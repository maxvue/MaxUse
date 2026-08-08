import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNaN } from './isNaN';

describe('isNaN', () => {
    it('retorna true para NaN', () => {
        expect(isNaN(NaN)).toBe(true);
    });

    it('retorna true para objeto Number(NaN)', () => {
        expect(isNaN(new Number(NaN))).toBe(true);
    });

    it('retorna false para string "abc" (peculiaridade: diferente do isNaN global, não coage)', () => {
        expect(isNaN('abc')).toBe(false);
    });

    it('retorna false para números válidos e outros tipos', () => {
        expect(isNaN(3)).toBe(false);
        expect(isNaN(null)).toBe(false);
        expect(isNaN(undefined)).toBe(false);
        expect(isNaN({})).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isNaN(ref(NaN))).toBe(true);
        expect(isNaN(ref(3))).toBe(false);
    });
});
