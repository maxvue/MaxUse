import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { deepClone } from './deepClone';

describe('deepClone', () => {
    // Primitivos
    it('clona string', () => {
        expect(deepClone('hello')).toBe('hello');
    });

    it('clona número', () => {
        expect(deepClone(42)).toBe(42);
    });

    it('retorna null para null', () => {
        expect(deepClone(null)).toBe(null);
    });

    it('retorna undefined para undefined', () => {
        expect(deepClone(undefined)).toBe(undefined);
    });

    // Objetos
    it('clona objeto simples sem compartilhar referência', () => {
        const original = { a: 1, b: 'hello' };
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        expect(clone).not.toBe(original);
    });

    it('clona objeto profundo sem compartilhar referência', () => {
        const original = { a: { b: { c: 42 } } };
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        clone.a.b.c = 100;
        expect(original.a.b.c).toBe(42);
    });

    // Arrays
    it('clona array simples', () => {
        const original = [1, 2, 3];
        const clone = deepClone(original);
        expect(clone).toEqual(original);
        expect(clone).not.toBe(original);
    });

    it('clona array aninhado sem compartilhar referência', () => {
        const original = [[1, 2], [3, 4]];
        const clone = deepClone(original);
        clone[0][0] = 99;
        expect(original[0][0]).toBe(1);
    });

    // Date
    it('clona Date mantendo o timestamp', () => {
        const original = new Date('2026-01-15');
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Date);
        expect(clone.getTime()).toBe(original.getTime());
        expect(clone).not.toBe(original);
    });

    // RegExp
    it('clona RegExp mantendo source e flags', () => {
        const original = /test/gi;
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(RegExp);
        expect(clone.source).toBe('test');
        expect(clone.flags).toBe('gi');
        expect(clone).not.toBe(original);
    });

    // Map
    it('clona Map com profundidade', () => {
        const original = new Map([['key', { nested: true }]]);
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Map);
        expect(clone.get('key')).toEqual({ nested: true });
        expect(clone.get('key')).not.toBe(original.get('key'));
    });

    // Set
    it('clona Set', () => {
        const original = new Set([1, 2, 3]);
        const clone = deepClone(original);
        expect(clone).toBeInstanceOf(Set);
        expect(clone.size).toBe(3);
        expect(clone).not.toBe(original);
    });

    // Referências circulares
    it('lida com referências circulares sem loop infinito', () => {
        const original: any = { a: 1 };
        original.self = original;
        const clone = deepClone(original);
        expect(clone.a).toBe(1);
        expect(clone.self).toBe(clone);
        expect(clone.self).not.toBe(original);
    });

    // Symbols
    it('clona propriedades com Symbol como chave', () => {
        const sym = Symbol('test');
        const original = { [sym]: 'value', normal: 42 };
        const clone = deepClone(original);
        expect(clone[sym]).toBe('value');
        expect(clone.normal).toBe(42);
    });

    // Reatividade
    it('funciona com Ref', () => {
        const original = ref({ a: 1 });
        const clone = deepClone(original);
        expect(clone).toEqual({ a: 1 });
    });

    it('funciona com Getter', () => {
        const clone = deepClone(() => ({ b: 2 }));
        expect(clone).toEqual({ b: 2 });
    });
});
