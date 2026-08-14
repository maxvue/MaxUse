import { describe, it, expect, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
    it('formata número inteiro', () => {
        const result = formatCurrency(1000);
        expect(result).toContain('1.000');
        expect(result).toContain('R$');
    });

    it('formata número com decimais', () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain('1.234,56');
    });

    it('formata zero como R$ 0,00 (isBlank(0) intercepta)', () => {
        expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('retorna R$ 0,00 para null', () => {
        expect(formatCurrency(null)).toBe('R$ 0,00');
    });

    it('retorna R$ 0,00 para NaN', () => {
        expect(formatCurrency('abc')).toBe('R$ 0,00');
    });

    it('formata negativos', () => {
        const result = formatCurrency(-500);
        expect(result).toContain('500');
    });

    it('funciona com string numérica', () => {
        const result = formatCurrency('1234.56');
        expect(result).toContain('1.234');
    });

    it('funciona com Ref', () => {
        const result = formatCurrency(ref(100));
        expect(result).toContain('100');
    });

    it('formata strings no formato brasileiro pt-BR com vírgula', () => {
        const res1 = formatCurrency('1.234,56');
        expect(res1).toContain('1.234,56');

        const res2 = formatCurrency('10,5');
        expect(res2).toContain('10,50');
    });

    it('interpreta ponto como separador de milhar em pt-BR', () => {
        expect(formatCurrency('1.234')).toBe('R$ 1.234,00');
        expect(formatCurrency('1.234.567')).toBe('R$ 1.234.567,00');
    });

    it('faz round-trip do próprio formato de saída', () => {
        expect(formatCurrency(formatCurrency(1234.56))).toBe('R$ 1.234,56');
    });

    it('retorna R$ 0,00 para Infinity', () => {
        expect(formatCurrency(Infinity)).toBe('R$ 0,00');
    });
});

describe('formatCurrency — reuso da instância de Intl.NumberFormat', () => {
    type ConstrutorNumberFormat = new (...args: unknown[]) => Intl.NumberFormat;

    /**
     * Espiona o construtor `Intl.NumberFormat` mantendo o comportamento real.
     * Precisa ser uma `function` (e não arrow) para poder ser usada com `new`.
     */
    function spiarIntlNumberFormat() {
        const original = Intl.NumberFormat as ConstrutorNumberFormat;

        return vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (...args: unknown[]) {
            return new original(...args);
        } as never);
    }

    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('constrói o Intl.NumberFormat uma única vez, mesmo com muitas chamadas', async () => {
        vi.resetModules();

        const spy = spiarIntlNumberFormat();

        const { formatCurrency: fresh } = await import('./currency');
        for (let i = 1; i <= 100; i++) fresh(i);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('não instancia nada no import do módulo (inicialização preguiçosa)', async () => {
        vi.resetModules();

        const spy = spiarIntlNumberFormat();

        await import('./currency');

        expect(spy).not.toHaveBeenCalled();
    });

    it('usa exatamente locale pt-BR e as opções de moeda BRL', async () => {
        vi.resetModules();

        const spy = spiarIntlNumberFormat();

        const { formatCurrency: fresh } = await import('./currency');
        fresh(1);

        expect(spy).toHaveBeenCalledWith('pt-BR', { style: 'currency', currency: 'BRL' });
    });

    it('produz a mesma saída em chamadas repetidas', () => {
        expect(formatCurrency(1234.5)).toBe('R$ 1.234,50');
        expect(formatCurrency(1234.5)).toBe(formatCurrency(1234.5));

        for (let i = 0; i < 50; i++) expect(formatCurrency(1234.5)).toBe('R$ 1.234,50');
    });

    it('não contamina a saída entre valores distintos formatados em sequência', () => {
        const esperado: Array<[number | string, string]> = [
            [1, 'R$ 1,00'],
            [-500, '-R$ 500,00'],
            [1234.56, 'R$ 1.234,56'],
            [1000, 'R$ 1.000,00'],
            ['1.234,56', 'R$ 1.234,56'],
            [0.5, 'R$ 0,50'],
            [1234567.891, 'R$ 1.234.567,89']
        ];

        for (const [entrada, saida] of esperado) expect(formatCurrency(entrada)).toBe(saida);

        // segunda passada na ordem inversa: a instância compartilhada não guarda estado
        for (const [entrada, saida] of [...esperado].reverse()) expect(formatCurrency(entrada)).toBe(saida);
    });

    it('mantém a normalização de espaço não-quebrável', () => {
        const saida = formatCurrency(1234.5);
        expect(saida).not.toContain(' ');
        expect(saida).not.toContain(' ');
        expect(saida).toContain('R$ ');
    });
});
