import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { includes } from './includes';

describe('includes', () => {
    it('funciona em array', () => {
        expect(includes([1, 2, 3], 2)).toBe(true);
        expect(includes([1, 2, 3], 5)).toBe(false);
    });

    it('funciona em objeto verificando os valores', () => {
        expect(includes({ a: 1, b: 2 }, 2)).toBe(true);
        expect(includes({ a: 1, b: 2 }, 5)).toBe(false);
    });

    it('funciona em string', () => {
        expect(includes('abc', 'b')).toBe(true);
        expect(includes('abc', 'z')).toBe(false);
    });

    it('usa SameValueZero: encontra NaN', () => {
        expect(includes([1, 2, NaN], NaN)).toBe(true);
    });

    it('respeita fromIndex negativo', () => {
        expect(includes([1, 2, 3], 2, -1)).toBe(false);
        expect(includes('abc', 'b', -1)).toBe(false);
    });

    it('retorna false para null/undefined', () => {
        expect(includes(null, 1)).toBe(false);
        expect(includes(undefined, 1)).toBe(false);
    });

    it('retorna false para objeto vazio', () => {
        expect(includes({}, 1)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(includes(ref([1, 2, 3]), 2)).toBe(true);
    });
});
