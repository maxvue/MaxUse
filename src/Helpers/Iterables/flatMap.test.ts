import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flatMap } from './flatMap';

describe('flatMap', () => {
    it('mapeia e achata em 1 nível', () => {
        expect(flatMap([1, 2, 3], (x: number) => [x, x * 2])).toEqual([1, 2, 2, 4, 3, 6]);
    });

    it('valores não-array retornados pelo iteratee ficam intocados', () => {
        expect(flatMap([1, 2, 3], (x: number) => x)).toEqual([1, 2, 3]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(flatMap([{ a: [1, 2] }, { a: [3, 4] }], 'a')).toEqual([1, 2, 3, 4]);
    });

    it('retorna vazio para coleção null ou undefined', () => {
        expect(flatMap(null, (x: unknown) => x)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flatMap(ref([1, 2]), (x: number) => [x, x])).toEqual([1, 1, 2, 2]);
    });
});
