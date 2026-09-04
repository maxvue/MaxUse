import { describe, it, expect } from 'vitest';
import { isIterateeCall } from './_isIterateeCall';

describe('isIterateeCall', () => {
    it('detecta a assinatura de iteratee de .map() em array', () => {
        const arr = [4, 8];
        expect(isIterateeCall(4, 0, arr)).toBe(true);
        expect(isIterateeCall(8, 1, arr)).toBe(true);
    });

    it('detecta a assinatura de iteratee em objeto array-like', () => {
        const arrayLike = { 0: 'a', 1: 'b', length: 2 };
        expect(isIterateeCall('a', 0, arrayLike)).toBe(true);
        expect(isIterateeCall('b', 1, arrayLike)).toBe(true);
    });

    it('detecta a assinatura com chave string', () => {
        const obj = { a: 1, b: 2 };
        expect(isIterateeCall(1, 'a', obj)).toBe(true);
        expect(isIterateeCall(2, 'b', obj)).toBe(true);
    });

    it('rejeita quando o valor não bate com o elemento no índice', () => {
        expect(isIterateeCall(4, 1, [4, 8])).toBe(false);
        expect(isIterateeCall(99, 0, [4, 8])).toBe(false);
    });

    it('rejeita quando o índice está fora dos limites', () => {
        expect(isIterateeCall(4, 5, [4, 8])).toBe(false);
        expect(isIterateeCall(4, -1, [4, 8])).toBe(false);
    });

    it('rejeita índice não inteiro', () => {
        expect(isIterateeCall(4, 0.5, [4, 8])).toBe(false);
    });

    it('rejeita quando o terceiro argumento não é objeto', () => {
        expect(isIterateeCall(4, 0, true)).toBe(false);
        expect(isIterateeCall(4, 0, undefined)).toBe(false);
        expect(isIterateeCall(4, 0, null)).toBe(false);
        expect(isIterateeCall(4, 0, 10)).toBe(false);
        expect(isIterateeCall(4, 0, 'abc')).toBe(false);
    });

    it('rejeita chave string ausente no objeto', () => {
        expect(isIterateeCall(1, 'z', { a: 1 })).toBe(false);
    });

    it('rejeita índice numérico em objeto que não é array-like', () => {
        expect(isIterateeCall(1, 0, { a: 1 })).toBe(false);
    });

    it('rejeita array vazio', () => {
        expect(isIterateeCall(undefined, 0, [])).toBe(false);
    });

    it('trata NaN como equivalente a NaN (SameValueZero)', () => {
        expect(isIterateeCall(NaN, 0, [NaN])).toBe(true);
    });
});
