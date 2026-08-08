import { describe, it, expect } from 'vitest';
import { defaultsDeep } from './defaultsDeep';

describe('defaultsDeep', () => {
    it('preenche recursivamente chaves ausentes em objetos aninhados', () => {
        expect(defaultsDeep({ a: { b: 2 } }, { a: { b: 1, c: 3 } })).toEqual({ a: { b: 2, c: 3 } });
    });

    it('preserva valores já definidos, mesmo aninhados', () => {
        expect(defaultsDeep({ a: { x: 1 } }, { a: { x: 2, y: 3 } })).toEqual({ a: { x: 1, y: 3 } });
    });

    it('preenche objeto aninhado inteiro quando destino está vazio', () => {
        expect(defaultsDeep({}, { a: { b: 1 } })).toEqual({ a: { b: 1 } });
    });

    it('peculiaridade: fonte string é tratada como array-like e mesclada por índice', () => {
        expect(defaultsDeep({}, 'ab')).toEqual({ 0: 'a', 1: 'b' });
    });
});
