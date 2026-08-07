import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toPath } from './toPath';

describe('toPath', () => {
    it('divide caminho com ponto e colchete', () => {
        expect(toPath('a[0].b.c')).toEqual(['a', '0', 'b', 'c']);
        expect(toPath('a.b[1][2]')).toEqual(['a', 'b', '1', '2']);
    });

    it('suporta chave entre aspas dentro de colchetes (peculiaridade)', () => {
        expect(toPath('["a-b"].c')).toEqual(['a-b', 'c']);
    });

    it('converte array em array de strings, preservando símbolos', () => {
        const sym = Symbol('x');
        expect(toPath([1, 'a', sym])).toEqual(['1', 'a', sym]);
    });

    it('envolve symbol único em array', () => {
        const sym = Symbol('x');
        expect(toPath(sym)).toEqual([sym]);
    });

    it('retorna array vazio para null, undefined e string vazia', () => {
        expect(toPath(null)).toEqual([]);
        expect(toPath(undefined)).toEqual([]);
        expect(toPath('')).toEqual([]);
    });

    it('converte número em string única', () => {
        expect(toPath(123)).toEqual(['123']);
    });

    it('funciona com Ref', () => {
        expect(toPath(ref('a.b.c'))).toEqual(['a', 'b', 'c']);
    });

    it('preserva -0 como "-0" (peculiaridade, herdada de toString)', () => {
        expect(toPath(-0)).toEqual(['-0']);
        expect(toPath([-0, 'a'])).toEqual(['-0', 'a']);
    });

    it('converte null/undefined em texto literal dentro de array (peculiaridade: diferente do toString de nível externo)', () => {
        expect(toPath([null, 'a'])).toEqual(['null', 'a']);
        expect(toPath([undefined, 'a'])).toEqual(['undefined', 'a']);
    });
});
