import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flatten } from './flatten';

describe('flatten', () => {
    it('achata apenas 1 nível', () => {
        expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
    });

    it('retorna igual quando já é plano', () => {
        expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio', () => {
        expect(flatten([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(flatten(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(flatten(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flatten(ref([1, [2, 3]]))).toEqual([1, 2, 3]);
    });
});
