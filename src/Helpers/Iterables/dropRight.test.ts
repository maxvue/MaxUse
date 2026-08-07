import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { dropRight } from './dropRight';

describe('dropRight', () => {
    it('n default 1', () => {
        expect(dropRight([1, 2, 3])).toEqual([1, 2]);
    });

    it('remove n elementos do fim', () => {
        expect(dropRight([1, 2, 3], 2)).toEqual([1]);
    });

    it('retorna o array completo para n=0', () => {
        expect(dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
    });

    it('trata n negativo como 0', () => {
        expect(dropRight([1, 2, 3], -1)).toEqual([1, 2, 3]);
    });

    it('retorna vazio quando n excede o tamanho', () => {
        expect(dropRight([1, 2, 3], 10)).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(dropRight([], 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(dropRight(null, 1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(dropRight(ref([1, 2, 3]), 1)).toEqual([1, 2]);
    });
});
