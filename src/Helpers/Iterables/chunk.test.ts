import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chunk } from './chunk';

describe('chunk', () => {
    it('divide array em chunks de tamanho específico', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('retorna array inteiro quando tamanho > array.length', () => {
        expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
    });

    it('retorna array vazio para null', () => {
        expect(chunk(null as any, 2)).toEqual([]);
    });

    it('retorna array vazio para array vazio', () => {
        expect(chunk([], 2)).toEqual([]);
    });

    it('retorna array vazio para size <= 0', () => {
        expect(chunk([1, 2, 3], 0)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(chunk(ref([1, 2, 3, 4]), 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('trunca tamanho fracionário', () => {
        expect(chunk([1, 2, 3, 4], 1.5)).toEqual([[1], [2], [3], [4]]);
    });
});
