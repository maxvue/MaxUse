import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { parseInt } from './parseInt';

describe('parseInt', () => {
    it('converte string numérica para inteiro', () => {
        expect(parseInt('08')).toBe(8);
        expect(parseInt('3.5')).toBe(3);
    });

    it('remove espaços à esquerda antes de converter (peculiaridade)', () => {
        expect(parseInt(' 08')).toBe(8);
        expect(parseInt('  42')).toBe(42);
    });

    it('aceita radix explícito', () => {
        expect(parseInt('08', 10)).toBe(8);
        expect(parseInt('1f', 16)).toBe(31);
    });

    it('retorna NaN para strings não numéricas, null e undefined', () => {
        expect(parseInt('abc')).toBeNaN();
        expect(parseInt(null)).toBeNaN();
        expect(parseInt(undefined)).toBeNaN();
    });

    it('funciona com Ref', () => {
        expect(parseInt(ref('08'))).toBe(8);
    });
});
