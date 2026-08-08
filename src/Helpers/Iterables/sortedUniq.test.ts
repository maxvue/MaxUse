import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedUniq } from './sortedUniq';

describe('sortedUniq', () => {
    it('remove duplicatas consecutivas', () => {
        expect(sortedUniq([1, 1, 2, 2, 3])).toEqual([1, 2, 3]);
    });

    it('não remove duplicatas não consecutivas', () => {
        expect(sortedUniq([1, 2, 1])).toEqual([1, 2, 1]);
    });

    it('usa SameValueZero: deduplica NaN consecutivo', () => {
        expect(sortedUniq([1, 1, NaN, NaN, 2])).toEqual([1, NaN, 2]);
    });

    it('retorna vazio para array vazio', () => {
        expect(sortedUniq([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(sortedUniq(null)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(sortedUniq(ref([1, 1, 2]))).toEqual([1, 2]);
    });
});
