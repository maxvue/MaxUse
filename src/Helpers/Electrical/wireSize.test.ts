import { describe, it, expect } from 'vitest';
import { wireSize } from './wireSize';

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

    it('aplica fatores de correção (fca/fct)', async () => {
        const semCorrecao = await wireSize(30, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2
        });

        const comCorrecao = await wireSize(30, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2,
            fca: 0.7,
            fct: 0.87
        });

        // Com fatores de correção menor que 1, a corrente corrigida sobe
        expect(semCorrecao).not.toBeNull();
        expect(comCorrecao).not.toBeNull();
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

    it('lida com método de instalação inexistente (catch no import dinâmico)', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            length: 10,
            phases: 2,
            method: 'z99'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(0);
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

    it('calcula com método b1 bifásico (corrente baixa → tabela prevalece)', async () => {
        // Corrente baixa + distância curta → fórmula retorna bitola pequena
        // Tabela b1 pode indicar bitola maior → branch item.wire >= data_return.wire (L119)
        const result = await wireSize(420, {
            material: 'copper',
            voltage: 220,
            length: 5,
            phases: 2,
            method: 'b1'
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThanOrEqual(240);
    });

    it('calcula com método b1 bifásico (corrente muito alta + distância longa → fórmula prevalece)', async () => {
        // Corrente alta + distância longa → fórmula calcula bitola grande
        // item da tabela pode ter wire menor → branch else if (item) (L122-124)
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
        // '0' não é isBlank, mas parseFloat('0') = 0 → retorna objeto com wire: 0
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

    it('entra no branch else if (item) quando bitola calculada é maior que a da tabela e encontra wire_table', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            length: 650, // Comprimento muito longo forçando bitola calculada ser ~300. Na tabela desordenada, o item encontrado é wire 240.
            phases: 2,
            method: 'b1',
            max_loss: 1
        });
        expect(result).not.toBeNull();
        expect(result!.wire).toBeGreaterThan(240);
        // Garante que wire_table foi encontrado e a linha 124 foi executada
        expect(result!.max_current).toBe(477); // O max_current para a bitola 300 na tabela b1
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
        expect(res90!.voltage_drop).toBeGreaterThan(res70!.voltage_drop);
    });

    it('testa branch if (wire_table) falso com arquivo real reduzido', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            phases: 2,
            method: 'mocktest'
        });
        expect(result).not.toBeNull();
    });

    it('testa branch module.default || module retornando default undefined para forçar o ||', async () => {
        const result = await wireSize(20, {
            material: 'copper',
            voltage: 220,
            phases: 2,
            method: 'falsy'
        });

        expect(result).not.toBeNull();
    });
});

describe('calculaCabo (alias)', () => {
    it('é referência direta de wireSize', async () => {
        const { calculaCabo } = await import('./wireSize');
        expect(calculaCabo).toBe(wireSize);
    });
});
