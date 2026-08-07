import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isSafeInteger } from './isSafeInteger';

describe('isSafeInteger', () => {
    it('retorna true para inteiros dentro do intervalo seguro', () => {
        expect(isSafeInteger(3)).toBe(true);
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('retorna false para 2**53 (peculiaridade: fora do intervalo seguro)', () => {
        expect(isSafeInteger(2 ** 53)).toBe(false);
    });

    it('retorna false para não-inteiros e outros tipos', () => {
        expect(isSafeInteger(3.5)).toBe(false);
        expect(isSafeInteger(NaN)).toBe(false);
        expect(isSafeInteger('3')).toBe(false);
        expect(isSafeInteger(null)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isSafeInteger(ref(3))).toBe(true);
        expect(isSafeInteger(ref(2 ** 53))).toBe(false);
    });
});
