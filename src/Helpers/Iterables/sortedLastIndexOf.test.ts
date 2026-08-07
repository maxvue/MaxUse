import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedLastIndexOf } from './sortedLastIndexOf';

describe('sortedLastIndexOf', () => {
    it('retorna a última ocorrência', () => {
        expect(sortedLastIndexOf([1, 1, 2, 2], 2)).toBe(3);
    });

    it('retorna -1 quando não encontra', () => {
        expect(sortedLastIndexOf([1, 1, 2, 2], 3)).toBe(-1);
    });

    it('retorna -1 para array vazio', () => {
        expect(sortedLastIndexOf([], 1)).toBe(-1);
    });

    it('retorna -1 para null', () => {
        expect(sortedLastIndexOf(null, 1)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(sortedLastIndexOf(ref([1, 2, 2, 3]), 2)).toBe(2);
    });
});
