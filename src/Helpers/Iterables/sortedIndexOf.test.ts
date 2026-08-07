import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedIndexOf } from './sortedIndexOf';

describe('sortedIndexOf', () => {
    it('retorna a primeira ocorrência', () => {
        expect(sortedIndexOf([1, 1, 2, 2], 2)).toBe(2);
    });

    it('retorna -1 quando não encontra', () => {
        expect(sortedIndexOf([1, 1, 2, 2], 3)).toBe(-1);
    });

    it('retorna -1 para array vazio', () => {
        expect(sortedIndexOf([], 1)).toBe(-1);
    });

    it('retorna -1 para null', () => {
        expect(sortedIndexOf(null, 1)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(sortedIndexOf(ref([1, 2, 3]), 3)).toBe(2);
    });
});
