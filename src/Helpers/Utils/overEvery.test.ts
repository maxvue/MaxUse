import { describe, it, expect } from 'vitest';
import { overEvery } from './overEvery';

describe('overEvery', () => {
    it('retorna true quando todos os predicados retornam verdadeiro', () => {
        const check = overEvery([(x: number) => x > 0, (x: number) => x < 10]);
        expect(check(5)).toBe(true);
    });

    it('retorna false quando algum predicado falha', () => {
        const check = overEvery([(x: number) => x > 0, (x: number) => x < 10]);
        expect(check(-1)).toBe(false);
        expect(check(20)).toBe(false);
    });

    it('lista vazia sempre retorna true', () => {
        expect(overEvery([])(1)).toBe(true);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        const check = overEvery(['a', 'b']);
        expect(check({ a: 1, b: 1 })).toBe(true);
        expect(check({ a: 1, b: 0 })).toBe(false);
    });

    it('peculiaridade: aceita argumentos variádicos, equivalente a um único array', () => {
        const check = overEvery((x: number) => x > 0, (x: number) => x < 10);
        expect(check(5)).toBe(true);
        expect(check(-1)).toBe(false);
    });

    it('sem nenhum argumento, lista vazia sempre retorna true', () => {
        expect(overEvery()(1)).toBe(true);
    });
});
