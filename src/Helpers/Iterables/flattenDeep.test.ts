import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flattenDeep } from './flattenDeep';

describe('flattenDeep', () => {
    it('achata em qualquer profundidade', () => {
        expect(flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('retorna igual quando já é plano', () => {
        expect(flattenDeep([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio', () => {
        expect(flattenDeep([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(flattenDeep(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(flattenDeep(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flattenDeep(ref([1, [2, [3]]]))).toEqual([1, 2, 3]);
    });
});
