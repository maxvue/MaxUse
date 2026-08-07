import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { clone } from './clone';

describe('clone', () => {
    it('cria cópia rasa de objeto, mantendo mesma referência dos valores aninhados', () => {
        const nested = { c: 2 };
        const original = { a: 1, b: nested };
        const cloned = clone(original);
        expect(cloned).toEqual(original);
        expect(cloned).not.toBe(original);
        expect(cloned.b).toBe(nested);
    });

    it('cria cópia rasa de array', () => {
        const nested = [2, 3];
        const original = [1, nested];
        const cloned = clone(original);
        expect(cloned).toEqual(original);
        expect(cloned).not.toBe(original);
        expect(cloned[1]).toBe(nested);
    });

    it('preserva o tipo Date, RegExp e Map (peculiaridade: preserva tipo)', () => {
        const date = new Date(2020, 0, 1);
        const clonedDate = clone(date);
        expect(clonedDate).toBeInstanceOf(Date);
        expect(clonedDate.getTime()).toBe(date.getTime());
        expect(clonedDate).not.toBe(date);

        const re = /abc/gi;
        const clonedRe = clone(re);
        expect(clonedRe).toBeInstanceOf(RegExp);
        expect(clonedRe.source).toBe('abc');
        expect(clonedRe.flags).toBe('gi');

        const map = new Map([['a', 1]]);
        const clonedMap = clone(map);
        expect(clonedMap).toBeInstanceOf(Map);
        expect(clonedMap.get('a')).toBe(1);
        expect(clonedMap).not.toBe(map);
    });

    it('preserva o protótipo de instância de classe', () => {
        class Foo {
            a = 1;
        }
        const instance = new Foo();
        const cloned = clone(instance);
        expect(cloned).toBeInstanceOf(Foo);
        expect(cloned.a).toBe(1);
        expect(cloned).not.toBe(instance);
    });

    it('retorna o próprio valor para primitivos, null e undefined', () => {
        expect(clone(3)).toBe(3);
        expect(clone('abc')).toBe('abc');
        expect(clone(null)).toBe(null);
        expect(clone(undefined)).toBe(undefined);
    });

    it('funciona com Ref', () => {
        const original = { a: 1 };
        const cloned = clone(ref(original));
        expect(cloned).toEqual({ a: 1 });
        expect(cloned).not.toBe(original);
    });

    it('clona função como objeto sem executá-la (peculiaridade: não usa toValue)', () => {
        let called = false;
        const fn = () => { called = true; return 42; };
        (fn as unknown as { extra: number }).extra = 1;
        const cloned = clone(fn);
        expect(called).toBe(false);
        expect(cloned).toEqual({ extra: 1 });
        expect(typeof cloned).toBe('object');
    });
});
