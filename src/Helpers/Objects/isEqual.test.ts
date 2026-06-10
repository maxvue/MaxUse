import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isEqual } from './isEqual';

describe('isEqual', () => {
    // Primitivos
    it('compara strings iguais', () => {
        expect(isEqual('abc', 'abc')).toBe(true);
    });

    it('compara strings diferentes', () => {
        expect(isEqual('abc', 'def')).toBe(false);
    });

    it('compara números iguais', () => {
        expect(isEqual(42, 42)).toBe(true);
    });

    it('compara números diferentes', () => {
        expect(isEqual(1, 2)).toBe(false);
    });

    it('compara mesma referência', () => {
        const obj = { a: 1 };
        expect(isEqual(obj, obj)).toBe(true);
    });

    // NaN
    it('considera NaN igual a NaN', () => {
        expect(isEqual(NaN, NaN)).toBe(true);
    });

    // null/undefined
    it('null e undefined são diferentes', () => {
        expect(isEqual(null, undefined)).toBe(false);
    });

    it('null é igual a null', () => {
        expect(isEqual(null, null)).toBe(true);
    });

    // Date
    it('compara Dates com mesmo timestamp', () => {
        const d1 = new Date('2026-01-01');
        const d2 = new Date('2026-01-01');
        expect(isEqual(d1, d2)).toBe(true);
    });

    it('compara Dates com timestamps diferentes', () => {
        const d1 = new Date('2026-01-01');
        const d2 = new Date('2026-06-15');
        expect(isEqual(d1, d2)).toBe(false);
    });

    // RegExp
    it('compara RegExps iguais', () => {
        expect(isEqual(/test/gi, /test/gi)).toBe(true);
    });

    it('compara RegExps com flags diferentes', () => {
        expect(isEqual(/test/g, /test/i)).toBe(false);
    });

    // Map
    it('compara Maps iguais', () => {
        const m1 = new Map([['a', 1], ['b', 2]]);
        const m2 = new Map([['a', 1], ['b', 2]]);
        expect(isEqual(m1, m2)).toBe(true);
    });

    it('compara Maps com chaves iguais mas valores diferentes', () => {
        const m1 = new Map([['a', 1]]);
        const m2 = new Map([['a', 2]]);
        expect(isEqual(m1, m2)).toBe(false);
    });

    it('compara Maps com chaves diferentes', () => {
        const m1 = new Map([['a', 1]]);
        const m2 = new Map([['b', 1]]);
        expect(isEqual(m1, m2)).toBe(false);
    });

    it('compara Maps com tamanhos diferentes', () => {
        const m1 = new Map([['a', 1]]);
        const m2 = new Map([['a', 1], ['b', 2]]);
        expect(isEqual(m1, m2)).toBe(false);
    });

    // Set
    it('compara Sets iguais', () => {
        const s1 = new Set([1, 2, 3]);
        const s2 = new Set([1, 2, 3]);
        expect(isEqual(s1, s2)).toBe(true);
    });

    it('compara Sets com tamanhos diferentes', () => {
        const s1 = new Set([1]);
        const s2 = new Set([1, 2]);
        expect(isEqual(s1, s2)).toBe(false);
    });

    it('compara Sets diferentes (mesmo tamanho)', () => {
        const s1 = new Set([1, 2]);
        const s2 = new Set([1, 3]);
        expect(isEqual(s1, s2)).toBe(false);
    });

    // Arrays
    it('compara arrays iguais', () => {
        expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('compara arrays com mesmo tamanho mas valores diferentes', () => {
        expect(isEqual([1, 2], [1, 3])).toBe(false);
    });

    it('compara arrays com tamanhos diferentes', () => {
        expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('compara arrays aninhados iguais', () => {
        expect(isEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
    });

    it('array e objeto são diferentes', () => {
        expect(isEqual([1], { 0: 1 })).toBe(false);
    });

    // Objetos profundos
    it('compara objetos profundos iguais', () => {
        const a = { x: { y: { z: 1 } } };
        const b = { x: { y: { z: 1 } } };
        expect(isEqual(a, b)).toBe(true);
    });

    it('compara objetos profundos diferentes', () => {
        const a = { x: { y: { z: 1 } } };
        const b = { x: { y: { z: 2 } } };
        expect(isEqual(a, b)).toBe(false);
    });

    it('compara objetos com número de chaves diferente', () => {
        expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(isEqual(ref(42), ref(42))).toBe(true);
        expect(isEqual(ref('a'), ref('b'))).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(isEqual(() => [1, 2], () => [1, 2])).toBe(true);
    });
});
