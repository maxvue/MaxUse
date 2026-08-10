import { describe, it, expect } from 'vitest';
import { baseSortedIndexBy } from './_baseSortedIndexBy';

describe('baseSortedIndexBy', () => {
    it('retorna 0 para array nulo ou vazio', () => {
        expect(baseSortedIndexBy(null, 5, (x) => x, false)).toBe(0);
        expect(baseSortedIndexBy([], 5, (x) => x, false)).toBe(0);
    });

    it('encontra índice de inserção para números comuns', () => {
        const arr = [10, 20, 30, 40, 50];
        expect(baseSortedIndexBy(arr, 25, (x) => x, false)).toBe(2);
        expect(baseSortedIndexBy(arr, 25, (x) => x, true)).toBe(2);
    });

    it('respeita retHighest quando há valores duplicados', () => {
        const arr = [10, 20, 20, 20, 30];
        expect(baseSortedIndexBy(arr, 20, (x) => x, false)).toBe(1);
        expect(baseSortedIndexBy(arr, 20, (x) => x, true)).toBe(4);
    });

    it('trata NaN, null, undefined e Symbol ordenando corretamente no final', () => {
        const sym = Symbol('s');
        const arr = [10, 20, null, undefined, NaN];

        expect(baseSortedIndexBy(arr, NaN, (x) => x, false)).toBe(4);
        expect(baseSortedIndexBy(arr, null, (x) => x, false)).toBe(2);
        expect(baseSortedIndexBy(arr, undefined, (x) => x, false)).toBe(3);
        expect(baseSortedIndexBy(arr, sym, (x) => x, false)).toBe(2);
    });
});
