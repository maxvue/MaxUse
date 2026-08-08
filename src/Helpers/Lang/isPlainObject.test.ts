import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isPlainObject } from './isPlainObject';

describe('isPlainObject', () => {
    it('retorna true para objeto literal e new Object()', () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject({ a: 1 })).toBe(true);

        expect(isPlainObject(new Object())).toBe(true);
    });

    it('retorna true para Object.create(null) (peculiaridade: sem protótipo)', () => {
        expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('retorna false para instância de classe', () => {
        class Foo {}
        expect(isPlainObject(new Foo())).toBe(false);
    });

    it('retorna false para array, Map, Date e função', () => {
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject(new Map())).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(function () {})).toBe(false);
    });

    it('retorna false para null e primitivos', () => {
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
        expect(isPlainObject(1)).toBe(false);
        expect(isPlainObject('abc')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isPlainObject(ref({}))).toBe(true);
        expect(isPlainObject(ref(1))).toBe(false);
    });
});
