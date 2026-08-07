import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import './thru';
import './wrapperNext';

describe('wrapperNext (método de instância .next())', () => {
    it('itera valores até done: true', () => {
        const w = chain([1, 2]);
        expect(w.next()).toEqual({ done: false, value: 1 });
        expect(w.next()).toEqual({ done: false, value: 2 });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });

    it('chamadas após done continuam retornando done: true', () => {
        const w = chain([1]);
        w.next();
        expect(w.next()).toEqual({ done: true, value: undefined });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });

    it('itera caracteres de string', () => {
        const w = chain('ab');
        expect(w.next()).toEqual({ done: false, value: 'a' });
        expect(w.next()).toEqual({ done: false, value: 'b' });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });

    it('itera valores de objeto plano', () => {
        const w = chain({ a: 1, b: 2 });
        expect(w.next()).toEqual({ done: false, value: 1 });
        expect(w.next()).toEqual({ done: false, value: 2 });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });

    it('retorna done: true imediatamente para número/null/undefined', () => {
        expect(chain(5).next()).toEqual({ done: true, value: undefined });
        expect(chain(null).next()).toEqual({ done: true, value: undefined });
        expect(chain(undefined).next()).toEqual({ done: true, value: undefined });
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2]));
        expect(w.next()).toEqual({ done: false, value: 1 });
    });

    it('empilhar uma nova ação (thru) após consumir .next() gera um wrapper independente, sem herdar o cache de __values__', () => {
        const w = chain([1, 2]);
        expect(w.next()).toEqual({ done: false, value: 1 });
        const w2 = w.thru((arr) => [...(arr as number[]), 3]);
        expect(w2.next()).toEqual({ done: false, value: 1 });
        expect(w2.next()).toEqual({ done: false, value: 2 });
        expect(w2.next()).toEqual({ done: false, value: 3 });
        expect(w2.next()).toEqual({ done: true, value: undefined });
    });

    it('itera objetos array-like por índice até length, ignorando outras chaves (não vaza "length" como valor)', () => {
        const w = chain({ 0: 'a', length: 1 });
        expect(w.next()).toEqual({ done: false, value: 'a' });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });

    it('array-like sem valores nos índices produz undefined para cada posição, não Object.values', () => {
        const w = chain({ a: 1, length: 2 });
        expect(w.next()).toEqual({ done: false, value: undefined });
        expect(w.next()).toEqual({ done: false, value: undefined });
        expect(w.next()).toEqual({ done: true, value: undefined });
    });
});
