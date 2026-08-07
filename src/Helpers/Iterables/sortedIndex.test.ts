import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedIndex } from './sortedIndex';

describe('sortedIndex', () => {
    it('busca binária: encontra índice de inserção', () => {
        expect(sortedIndex([30, 50], 40)).toBe(1);
    });

    it('insere antes de valores duplicados', () => {
        expect(sortedIndex([4, 4, 5, 5], 5)).toBe(2);
    });

    it('retorna 0 para valor menor que todos', () => {
        expect(sortedIndex([1, 2, 3], 0)).toBe(0);
    });

    it('retorna length para valor maior que todos', () => {
        expect(sortedIndex([1, 2, 3], 10)).toBe(3);
    });

    it('retorna 0 para array vazio', () => {
        expect(sortedIndex([], 1)).toBe(0);
    });

    it('retorna 0 para null', () => {
        expect(sortedIndex(null, 1)).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(sortedIndex(ref([1, 3, 5]), 4)).toBe(2);
    });
});
