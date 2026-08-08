import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNull } from './isNull';

describe('isNull', () => {
    it('retorna true para null', () => {
        expect(isNull(null)).toBe(true);
    });

    it('retorna false para undefined e outros valores', () => {
        expect(isNull(undefined)).toBe(false);
        expect(isNull(0)).toBe(false);
        expect(isNull('')).toBe(false);
        expect(isNull(false)).toBe(false);
        expect(isNull({})).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isNull(ref(null))).toBe(true);
        expect(isNull(ref(1))).toBe(false);
    });
});
