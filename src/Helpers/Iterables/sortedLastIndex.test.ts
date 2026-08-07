import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedLastIndex } from './sortedLastIndex';

describe('sortedLastIndex', () => {
    it('insere depois de valores duplicados', () => {
        expect(sortedLastIndex([4, 4, 5, 5], 5)).toBe(4);
    });

    it('difere de sortedIndex para duplicatas', () => {
        expect(sortedLastIndex([4, 4, 5, 5], 4)).toBe(2);
    });

    it('retorna 0 para valor menor que todos', () => {
        expect(sortedLastIndex([1, 2, 3], 0)).toBe(0);
    });

    it('retorna length para valor maior que todos', () => {
        expect(sortedLastIndex([1, 2, 3], 10)).toBe(3);
    });

    it('retorna 0 para array vazio', () => {
        expect(sortedLastIndex([], 1)).toBe(0);
    });

    it('retorna 0 para null', () => {
        expect(sortedLastIndex(null, 1)).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(sortedLastIndex(ref([1, 3, 5]), 3)).toBe(2);
    });
});
