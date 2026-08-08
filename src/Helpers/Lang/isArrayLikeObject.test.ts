import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isArrayLikeObject } from './isArrayLikeObject';

describe('isArrayLikeObject', () => {
    it('retorna true para array e objeto com length válido', () => {
        expect(isArrayLikeObject([1, 2, 3])).toBe(true);
        expect(isArrayLikeObject({ length: 2 })).toBe(true);
    });

    it('retorna false para string (peculiaridade: array-like mas não object-like)', () => {
        expect(isArrayLikeObject('abc')).toBe(false);
    });

    it('retorna false para função e objeto sem length válido', () => {
        expect(isArrayLikeObject(function () {})).toBe(false);
        expect(isArrayLikeObject({})).toBe(false);
    });

    it('retorna false para null e undefined', () => {
        expect(isArrayLikeObject(null)).toBe(false);
        expect(isArrayLikeObject(undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isArrayLikeObject(ref([1, 2]))).toBe(true);
        expect(isArrayLikeObject(ref('abc'))).toBe(false);
    });
});
