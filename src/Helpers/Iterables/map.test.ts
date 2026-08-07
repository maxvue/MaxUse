import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { map } from './map';

describe('map', () => {
    it('mapeia cada elemento de um array', () => {
        expect(map([1, 2, 3], (x: number) => x * 2)).toEqual([2, 4, 6]);
    });

    it('mapeia os valores de um objeto, sempre retornando array', () => {
        expect(map({ a: 1, b: 2 }, (x: number) => x * 2)).toEqual([2, 4]);
    });

    it('repassa índice/chave e a coleção para o iteratee', () => {
        expect(map({ a: 1, b: 2 }, (v: number, k: string) => k + v)).toEqual(['a1', 'b2']);
    });

    it('retorna vazio para null ou undefined', () => {
        expect(map(null, (x: unknown) => x)).toEqual([]);
        expect(map(undefined, (x: unknown) => x)).toEqual([]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(map([{ a: 1 }, { a: 2 }], 'a')).toEqual([1, 2]);
    });

    it('sem iteratee, usa identidade', () => {
        expect(map([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(map(ref([1, 2, 3]), (x: number) => x + 1)).toEqual([2, 3, 4]);
    });
});
