import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { times } from './times';

describe('times', () => {
    it('invoca iteratee n vezes, passando o índice', () => {
        expect(times(3, String)).toEqual(['0', '1', '2']);
    });

    it('sem iteratee, retorna os índices (peculiaridade)', () => {
        expect(times(3)).toEqual([0, 1, 2]);
    });

    it('retorna array vazio para n <= 0', () => {
        expect(times(0)).toEqual([]);
        expect(times(-1)).toEqual([]);
    });

    it('retorna array vazio para n acima de MAX_SAFE_INTEGER (guarda de limite)', () => {
        expect(times(Number.MAX_SAFE_INTEGER + 1)).toEqual([]);
    });

    it('trunca n fracionário', () => {
        expect(times(2.5)).toEqual([0, 1]);
    });

    it('funciona com Ref', () => {
        expect(times(ref(3))).toEqual([0, 1, 2]);
    });
});
