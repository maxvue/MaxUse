import { describe, it, expect } from 'vitest';
import { invertBy } from './invertBy';

describe('invertBy', () => {
    it('agrupa todas as chaves que produzem o mesmo valor invertido', () => {
        expect(invertBy({ a: 1, b: 2, c: 1 })).toEqual({ 1: ['a', 'c'], 2: ['b'] });
    });

    it('aceita iterateeFn para derivar a chave invertida', () => {
        expect(invertBy({ a: 1, b: 2, c: 1 }, (v: number) => 'group' + v)).toEqual({ group1: ['a', 'c'], group2: ['b'] });
    });

    it('retorna objeto vazio para objeto null ou undefined', () => {
        expect(invertBy(null)).toEqual({});
    });
});
