import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { invert } from './invert';

describe('invert', () => {
    it('inverte chaves e valores', () => {
        expect(invert({ a: 1, b: 2 })).toEqual({ 1: 'a', 2: 'b' });
    });

    it('peculiaridade: valores duplicados mantêm apenas a última chave', () => {
        expect(invert({ a: 1, b: 2, c: 1 })).toEqual({ 1: 'c', 2: 'b' });
    });

    it('retorna objeto vazio para objeto null ou undefined', () => {
        expect(invert(null)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(invert(ref({ x: 5 }))).toEqual({ 5: 'x' });
    });
});
