import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { without } from './without';

describe('without', () => {
    it('exclui os valores especificados', () => {
        expect(without([2, 1, 2, 3], 1, 2)).toEqual([3]);
    });

    it('usa SameValueZero: exclui NaN', () => {
        expect(without([NaN, 1], NaN)).toEqual([1]);
    });

    it('retorna vazio para array vazio', () => {
        expect(without([], 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(without(null, 1)).toEqual([]);
    });

    it('retorna o array original quando nenhum valor bate', () => {
        expect(without([1, 2, 3], 9)).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(without(ref([1, 2, 3]), 2)).toEqual([1, 3]);
    });
});
