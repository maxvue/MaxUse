import { describe, it, expect } from 'vitest';
import { zip } from './zip';

describe('zip', () => {
    it('agrupa elementos de mesmo índice', () => {
        expect(zip<string | number | boolean>(['a', 'b'], [1, 2], [true, false])).toEqual([['a', 1, true], ['b', 2, false]]);
    });

    it('preenche com undefined quando arrays têm tamanhos diferentes', () => {
        expect(zip<string | number>(['a'], [1, 2, 3])).toEqual([['a', 1], [undefined, 2], [undefined, 3]]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(zip()).toEqual([]);
    });

    it('funciona com arrays vazios', () => {
        expect(zip([], [])).toEqual([]);
    });
});
