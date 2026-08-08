import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isUndefined } from './isUndefined';

describe('isUndefined', () => {
    it('retorna true para undefined', () => {
        expect(isUndefined(undefined)).toBe(true);
    });

    it('retorna false para null e outros valores', () => {
        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(0)).toBe(false);
        expect(isUndefined('')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isUndefined(ref(undefined))).toBe(true);
        expect(isUndefined(ref(1))).toBe(false);
    });
});
