import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { fromPairs } from './fromPairs';

describe('fromPairs', () => {
    it('monta objeto a partir de pares', () => {
        expect(fromPairs([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
    });

    it('retorna objeto vazio para array vazio', () => {
        expect(fromPairs([])).toEqual({});
    });

    it('retorna objeto vazio para null', () => {
        expect(fromPairs(null)).toEqual({});
    });

    it('retorna objeto vazio para undefined', () => {
        expect(fromPairs(undefined)).toEqual({});
    });

    it('último par sobrescreve chave duplicada', () => {
        expect(fromPairs([['a', 1], ['a', 2]])).toEqual({ a: 2 });
    });

    it('funciona com Ref', () => {
        expect(fromPairs(ref([['x', 1]] as Array<[string, number]>))).toEqual({ x: 1 });
    });
});
