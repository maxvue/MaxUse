import { describe, it, expect } from 'vitest';
import { over } from './over';

describe('over', () => {
    it('invoca cada função com os argumentos recebidos e retorna os resultados em array', () => {
        expect(over([Math.max, Math.min])(1, 2, 3)).toEqual([3, 1]);
    });

    it('retorna array vazio para lista de iteratees vazia', () => {
        expect(over([])(1)).toEqual([]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(over(['a', 'b'])({ a: 1, b: 2 })).toEqual([1, 2]);
    });

    it('repassa this para as funções', () => {
        const fn = over([function (this: { base: number }, x: number) { return this.base + x; }]);
        expect(fn.apply({ base: 10 }, [5])).toEqual([15]);
    });

    it('peculiaridade: aceita argumentos variádicos, equivalente a um único array', () => {
        expect(over(Math.max, Math.min)(1, 2, 3)).toEqual([3, 1]);
    });

    it('sem nenhum argumento, retorna função que sempre produz array vazio', () => {
        expect(over()(1)).toEqual([]);
    });
});
