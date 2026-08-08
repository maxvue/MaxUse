import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isLength } from './isLength';

describe('isLength', () => {
    it('retorna true para inteiros não-negativos', () => {
        expect(isLength(0)).toBe(true);
        expect(isLength(3)).toBe(true);
        expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('retorna false para negativos, não-inteiros e acima do limite seguro', () => {
        expect(isLength(-1)).toBe(false);
        expect(isLength(3.5)).toBe(false);
        expect(isLength(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
        expect(isLength(Infinity)).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isLength(null)).toBe(false);
        expect(isLength(undefined)).toBe(false);
        expect(isLength('3')).toBe(false);
        expect(isLength(NaN)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isLength(ref(3))).toBe(true);
        expect(isLength(ref(-1))).toBe(false);
    });
});
