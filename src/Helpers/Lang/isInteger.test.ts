import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isInteger } from './isInteger';

describe('isInteger', () => {
    it('retorna true para inteiros', () => {
        expect(isInteger(3)).toBe(true);
        expect(isInteger(0)).toBe(true);
        expect(isInteger(-3)).toBe(true);
    });

    it('retorna false para não-inteiros, Infinity e NaN (peculiaridade)', () => {
        expect(isInteger(3.5)).toBe(false);
        expect(isInteger(Infinity)).toBe(false);
        expect(isInteger(NaN)).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isInteger(null)).toBe(false);
        expect(isInteger(undefined)).toBe(false);
        expect(isInteger('3')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isInteger(ref(3))).toBe(true);
        expect(isInteger(ref(3.5))).toBe(false);
    });
});
