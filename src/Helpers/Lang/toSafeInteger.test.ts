import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toSafeInteger } from './toSafeInteger';

describe('toSafeInteger', () => {
    it('retorna o inteiro quando já é seguro', () => {
        expect(toSafeInteger(3)).toBe(3);
    });

    it('grampeia valores fora do intervalo seguro (peculiaridade)', () => {
        expect(toSafeInteger(2 ** 60)).toBe(Number.MAX_SAFE_INTEGER);
        expect(toSafeInteger(-(2 ** 60))).toBe(-Number.MAX_SAFE_INTEGER);
    });

    it('preserva 0', () => {
        expect(toSafeInteger(0)).toBe(0);
    });

    it('retorna 0 para null e undefined', () => {
        expect(toSafeInteger(null)).toBe(0);
        expect(toSafeInteger(undefined)).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(toSafeInteger(ref(3.9))).toBe(3);
        expect(toSafeInteger(ref(2 ** 60))).toBe(Number.MAX_SAFE_INTEGER);
    });
});
