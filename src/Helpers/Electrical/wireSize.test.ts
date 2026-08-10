import { describe, it, expect } from 'vitest';
import { wireSize } from './wireSize';
import fs from 'node:fs';
import path from 'node:path';

describe('wireSize', () => {
    it('retorna null para corrente nula (isBlank)', async () => {
        expect(await wireSize(null, {})).toBe(null);
        expect(await wireSize('', {})).toBe(null);
    });

    it('usa valores padrao quando nao definidos em options (length, voltage, max_loss)', async () => {
        const result = await wireSize(20, {});
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
    });

    it('retorna null para corrente zero (isBlank(0) é true por padrão)', async () => {
        const result = await wireSize(0, {});
        expect(result).toBeNull();
    });

    it('rejeita corrente negativa e não-finita', async () => {
        expect(await wireSize(-50, {})).toBeNull();
        expect(await wireSize('abc' as never, {})).toBeNull();
        expect(await wireSize(NaN, {})).toBeNull();
    });

    it('calcula bitola para corrente simples (cobre, bifásico)', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2,
            max_loss: 5
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
        expect(result!.voltage_drop).toBeGreaterThan(0);
        expect(result!.loss_percent).toBeGreaterThan(0);
    });

    it('calcula para alumínio', async () => {
        const result = await wireSize(20, {
            material: 'aluminum',
            voltage: 220,
            length: 10,
            phases: 2,
            max_loss: 5
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
    });

    it('calcula para trifásico', async () => {
        const result = await wireSize(50, {
            material: 'copper',
            voltage: 220,
            length: 20,
            phases: 3,
            max_loss: 4
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
    });

    it('aplica seção mínima para iluminação (1.5mm²)', async () => {
        const result = await wireSize(1, {
            material: 'copper',
            voltage: 220,
            length: 5,
            phases: 2,
            circuit_type: 'lighting'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThanOrEqual(1.5);
    });

    it('aplica seção mínima para tomada (2.5mm²)', async () => {
        const result = await wireSize(1, {
            material: 'copper',
            voltage: 220,
            length: 5,
            phases: 2,
            circuit_type: 'power'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThanOrEqual(2.5);
    });

    it('nunca retorna seção abaixo do mínimo NBR 5410 para tomada/força (2.5mm²)', async () => {
        const result = await wireSize(2, {
            material: 'copper',
            voltage: 220,
            length: 1,
            phases: 2,
            method: 'b1',
            circuit_type: 'power'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThanOrEqual(2.5);
    });

    it('aplica fatores de correção (fca/fct) mesmo sem método informado', async () => {
        const semCorrecao = await wireSize(100, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2
        });

        const comCorrecao = await wireSize(100, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2,
            fca: 0.5,
            fct: 0.5
        });

        expect(semCorrecao).not.toBeNull();
        expect(comCorrecao).not.toBeNull();
        expect(comCorrecao!.wire).toBeGreaterThan(semCorrecao!.wire);
    });

    it('usa isolação 90° quando especificado epr/xlpe', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            isolation: 'epr',
            voltage: 220,
            length: 10,
            phases: 2
        });
        expect(result).not.toBeNull();
    });

    it('retorna bitola dentro da lista padrão', async () => {
        const bitolasValidas = [0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000];
        const result = await wireSize(25, {
            material: 'copper',
            voltage: 220,
            length: 15,
            phases: 2
        });
        expect(result).not.toBeNull();
        expect(bitolasValidas).toContain(result!.wire);
    });

    it('sinaliza quando a tabela não puder ser carregada', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2,
            method: 'z99'
        });
        expect(result).not.toBeNull();
        expect(result!.table_loaded).toBe(false);
    });

    it('calcula com método de instalação válido (trifásico)', async () => {
        const result = await wireSize(30, {
            material: 'copper',
            voltage: 220,
            length: 15,
            phases: 3,
            method: 'b1'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
    });

    it('dimensiona corretamente circuito residencial B1 de 20A', async () => {
        const r = await wireSize(20, {
            material: 'copper',
            isolation: '70',
            method: 'b1',
            phases: 2,
            voltage: 220,
            length: 10
        });
        expect(r).not.toBeNull();
        expect(r!.wire).toBe(2.5);
    });

    it.each([
        [20, 'b1', 'copper', '70', 2.5],
        [20, 'c', 'copper', '70', 2.5],
        [100, 'b1', 'copper', '70', 25]
    ])('dimensiona %iA em %s/%s/%s como %fmm²', async (current, method, material, isolation, expectedWire) => {
        const r = await wireSize(current, {
            material: material as never,
            isolation: isolation as never,
            method: method as never,
            phases: 2,
            voltage: 220,
            length: 10
        });
        expect(r).not.toBeNull();
        expect(r!.wire).toBe(expectedWire);
    });

    it('respeita max_loss na verificação final da queda de tensão', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            length: 100,
            phases: 2,
            max_loss: 2
        });
        expect(result).not.toBeNull();
        if (!result!.exceeded) expect(result!.loss_percent).toBeLessThanOrEqual(2);
    });

    it('calcula com método b1 bifásico (corrente alta + distância longa)', async () => {
        const result = await wireSize(500, {
            material: 'copper',
            voltage: 220,
            length: 200,
            phases: 2,
            method: 'b1',
            max_loss: 3
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
    });

    it('calcula com método alumínio bifásico', async () => {
        const result = await wireSize(30, {
            material: 'aluminum',
            voltage: 220,
            length: 10,
            phases: 2,
            method: 'b1'
        });
        expect(result).not.toBeNull();
    });

    it('calcula com método e isolação xlpe/epr (90°)', async () => {
        const result = await wireSize(30, {
            material: 'copper',
            isolation: 'xlpe',
            voltage: 220,
            length: 10,
            phases: 2,
            method: 'b1'
        });
        expect(result).not.toBeNull();
    });

    it('calcula corrente zero como string (parseFloat(0) retorna resultado zerado)', async () => {
        const result = await wireSize('0', {});
        expect(result).toEqual({ wire: 0, max_current: 0, voltage_drop: 0, loss_percent: 0 });
    });

    it('cai no fallback 1000 para bitola muito grande', async () => {
        const result = await wireSize(100000, {
            material: 'copper',
            voltage: 220,
            length: 10000,
            phases: 2,
            max_loss: 1
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBe(1000);
    });

    it('sinaliza exceeded: true quando a corrente excede a tabela', async () => {
        const result = await wireSize(2000, {
            material: 'copper',
            voltage: 220,
            length: 1,
            phases: 2,
            method: 'b1',
            max_loss: 5
        });
        expect(result).not.toBeNull();
        expect(result!.exceeded).toBe(true);
    });

    it('trata tensão trifásica com voltage_type "ff"', async () => {
        const result1 = await wireSize(50, { phases: 3, voltage: 380, voltage_type: 'ff' });
        expect(result1).not.toBeNull();
        expect(result1!.loss_percent).toBeLessThanOrEqual(5);
    });

    it('calcula queda de tensão diferente para alumínio 70°C vs 90°C', async () => {
        const res70 = await wireSize(100, { material: 'al', isolation: 'pvc', length: 100 });
        const res90 = await wireSize(100, { material: 'al', isolation: 'epr', length: 100 });
        expect(res90!.voltage_drop).not.toBe(res70!.voltage_drop);
    });

    it('todas as tabelas NBR estão em ordem crescente de max_current', () => {
        const jsonDir = path.resolve(__dirname, '../../json');
        const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(jsonDir, file), 'utf-8');
            const data = JSON.parse(content);
            if (Array.isArray(data)) {
                const currents = data.map((r: { max_current: number }) => r.max_current);
                expect(currents, `Arquivo ${file} está fora de ordem de max_current`).toEqual([...currents].sort((a, b) => a - b));
            }
        }
    });
});

describe('calculaCabo (alias)', () => {
    it('é referência direta de wireSize', async () => {
        const { calculaCabo } = await import('./wireSize');
        expect(calculaCabo).toBe(wireSize);
    });
});
