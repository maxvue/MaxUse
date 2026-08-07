import { describe, it, expect } from 'vitest';
import { stubArray } from './stubArray';

describe('stubArray', () => {
    it('retorna um array vazio', () => {
        expect(stubArray()).toEqual([]);
    });

    it('retorna uma nova instância a cada chamada (peculiaridade)', () => {
        expect(stubArray()).not.toBe(stubArray());
    });
});
