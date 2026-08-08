import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toString } from './toString';

describe('toString', () => {
    it('retorna string vazia para null e undefined no nível externo', () => {
        expect(toString(null)).toBe('');
        expect(toString(undefined)).toBe('');
    });

    it('converte números e strings diretamente', () => {
        expect(toString(123)).toBe('123');
        expect(toString('abc')).toBe('abc');
    });

    it('preserva -0 como "-0" (peculiaridade, diferente de String(-0))', () => {
        expect(toString(-0)).toBe('-0');
        expect(String(-0)).toBe('0');
    });

    it('junta elementos de array com vírgula, achatando arrays aninhados', () => {
        expect(toString([1, 2, 3])).toBe('1,2,3');
        expect(toString([1, [2, 3], 4])).toBe('1,2,3,4');
    });

    it('converte null/undefined dentro de array em texto literal (peculiaridade: diferente do nível externo)', () => {
        expect(toString([null, undefined, 1])).toBe('null,undefined,1');
    });

    it('converte símbolo preservando sua representação', () => {
        expect(toString(Symbol('x'))).toBe('Symbol(x)');
        expect(toString([Symbol('x'), 1])).toBe('Symbol(x),1');
    });

    it('usa Object.prototype.toString para objetos comuns', () => {
        expect(toString({ a: 1 })).toBe('[object Object]');
        expect(toString(new Map())).toBe('[object Map]');
    });

    it('usa o hint "default" da coerção (valueOf antes de toString), igual ao Lodash (peculiaridade)', () => {
        // hint "default": chama valueOf() primeiro, não toString() — diferente
        // de template literals (`${value}`), que usam hint "string".
        expect(toString({ valueOf: () => 5 })).toBe('5');
        expect(toString({ toString: () => 'x', valueOf: () => 7 })).toBe('7');
    });

    it('funciona com Ref', () => {
        expect(toString(ref(123))).toBe('123');
        expect(toString(ref(null))).toBe('');
    });

    it('preserva -0 mesmo quando embrulhado em Object() (peculiaridade)', () => {
        expect(toString(Object(-0))).toBe('-0');
    });
});
