import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNil } from './isNil';

describe('isNil', () => {
    it('retorna true para null e undefined', () => {
        expect(isNil(null)).toBe(true);
        expect(isNil(undefined)).toBe(true);
    });

    it('retorna false para valores falsy que não são nil', () => {
        expect(isNil(0)).toBe(false);
        expect(isNil('')).toBe(false);
        expect(isNil(NaN)).toBe(false);
        expect(isNil(false)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isNil(ref(null))).toBe(true);
        expect(isNil(ref(1))).toBe(false);
    });
});
