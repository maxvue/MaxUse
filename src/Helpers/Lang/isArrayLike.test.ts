import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isArrayLike } from './isArrayLike';

describe('isArrayLike', () => {
    it('retorna true para array, string e objeto com length válido', () => {
        expect(isArrayLike([1, 2, 3])).toBe(true);
        expect(isArrayLike('abc')).toBe(true);
        expect(isArrayLike({ length: 2 })).toBe(true);
    });

    it('retorna false para função, mesmo com length (peculiaridade: funções têm length mas são excluídas)', () => {
        expect(isArrayLike(function (a: number, b: number) {})).toBe(false);
    });

    it('retorna false para length negativo ou ausente', () => {
        expect(isArrayLike({ length: -1 })).toBe(false);
        expect(isArrayLike({})).toBe(false);
    });

    it('retorna false para null e undefined', () => {
        expect(isArrayLike(null)).toBe(false);
        expect(isArrayLike(undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isArrayLike(ref([1, 2]))).toBe(true);
        expect(isArrayLike(ref(1))).toBe(false);
    });
});
