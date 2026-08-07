import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flattenDepth } from './flattenDepth';

describe('flattenDepth', () => {
    it('achata até a profundidade especificada', () => {
        expect(flattenDepth([1, [2, [3, [4]], 5]], 2)).toEqual([1, 2, 3, [4], 5]);
    });

    it('depth default 1', () => {
        expect(flattenDepth([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
    });

    it('depth 0 não achata nada', () => {
        expect(flattenDepth([1, [2, 3]], 0)).toEqual([1, [2, 3]]);
    });

    it('retorna vazio para array vazio', () => {
        expect(flattenDepth([], 2)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(flattenDepth(null, 2)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flattenDepth(ref([1, [2, [3]]]), 2)).toEqual([1, 2, 3]);
    });
});
