import { describe, it, expect } from 'vitest';
import { overSome } from './overSome';

describe('overSome', () => {
    it('retorna true quando algum predicado retorna verdadeiro', () => {
        const check = overSome([(x: number) => x < 0, (x: number) => x > 10]);
        expect(check(-1)).toBe(true);
        expect(check(20)).toBe(true);
    });

    it('retorna false quando nenhum predicado retorna verdadeiro', () => {
        const check = overSome([(x: number) => x < 0, (x: number) => x > 10]);
        expect(check(5)).toBe(false);
    });

    it('lista vazia sempre retorna false', () => {
        expect(overSome([])(1)).toBe(false);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        const check = overSome(['a', 'b']);
        expect(check({ a: 1, b: 0 })).toBe(true);
        expect(check({ a: 0, b: 0 })).toBe(false);
    });

    it('peculiaridade: aceita argumentos variádicos, equivalente a um único array', () => {
        const check = overSome((x: number) => x < 0, (x: number) => x > 10);
        expect(check(-1)).toBe(true);
        expect(check(5)).toBe(false);
    });

    it('sem nenhum argumento, lista vazia sempre retorna false', () => {
        expect(overSome()(1)).toBe(false);
    });
});
