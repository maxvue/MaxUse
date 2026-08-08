import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flatMapDeep } from './flatMapDeep';

describe('flatMapDeep', () => {
    it('mapeia e achata recursivamente em qualquer profundidade', () => {
        expect(flatMapDeep([1, 2], (x: number) => [[x, [x * 2]]])).toEqual([1, 2, 2, 4]);
    });

    it('retorna vazio para coleção null ou undefined', () => {
        expect(flatMapDeep(null, (x: unknown) => x)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flatMapDeep(ref([1, 2]), (x: number) => [[x]])).toEqual([1, 2]);
    });
});
