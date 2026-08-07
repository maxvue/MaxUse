import { describe, it, expect } from 'vitest';
import { zipWith } from './zipWith';

describe('zipWith', () => {
    it('agrupa e combina os elementos de mesmo índice', () => {
        expect(zipWith([1, 2], [10, 20], [100, 200], (a: number, b: number, c: number) => a + b + c)).toEqual([111, 222]);
    });

    it('sem função de combinação (último argumento é array), comporta-se como zip', () => {
        expect(zipWith([1, 2], [10, 20])).toEqual([[1, 10], [2, 20]]);
    });
});
