import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { drop } from './drop';

describe('drop', () => {
    it('n default 1', () => {
        expect(drop([1, 2, 3])).toEqual([2, 3]);
    });

    it('remove n elementos do início', () => {
        expect(drop([1, 2, 3], 2)).toEqual([3]);
    });

    it('retorna o array completo para n=0', () => {
        expect(drop([1, 2, 3], 0)).toEqual([1, 2, 3]);
    });

    it('trata n negativo como 0', () => {
        expect(drop([1, 2, 3], -1)).toEqual([1, 2, 3]);
    });

    it('retorna vazio quando n excede o tamanho', () => {
        expect(drop([1, 2, 3], 10)).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(drop([], 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(drop(null, 1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(drop(ref([1, 2, 3]), 1)).toEqual([2, 3]);
    });
});
