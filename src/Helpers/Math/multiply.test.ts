import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { multiply } from './multiply';

describe('multiply', () => {
    it('multiplica dois números', () => {
        expect(multiply(6, 4)).toBe(24);
    });

    it('retorna 1 quando chamado sem argumentos (peculiaridade)', () => {
        expect(multiply()).toBe(1);
    });

    it('retorna o único valor fornecido quando o outro é undefined', () => {
        expect(multiply(6)).toBe(6);
        expect(multiply(undefined, 4)).toBe(4);
    });

    it('converte strings numéricas para número', () => {
        expect(multiply('3', '4')).toBe(12);
    });

    it('quando algum operando é string, aplica o operador direto sem baseToNumber (peculiaridade)', () => {
        // '3' * true === '3' * 'true' === NaN (baseToString em ambos, não baseToNumber)
        expect(multiply('3', true)).toBeNaN();
        expect(multiply(3, true)).toBe(3);
    });

    it('funciona com Ref', () => {
        expect(multiply(ref(6), ref(4))).toBe(24);
    });

    it('converte null/undefined em texto literal ao aplicar baseToString em ambos operandos (peculiaridade)', () => {
        expect(multiply(true, '1')).toBeNaN();
        expect(multiply('1', null)).toBeNaN();
    });
});
