import { describe, it, expect } from 'vitest';
import { baseAssignValue } from './_baseAssignValue';

describe('baseAssignValue', () => {
    it('atribui normalmente chaves comuns', () => {
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, 'a', 1);
        expect(target).toEqual({ a: 1 });
    });

    it('sobrescreve valor existente', () => {
        const target: Record<PropertyKey, unknown> = { a: 1 };
        baseAssignValue(target, 'a', 2);
        expect(target.a).toBe(2);
    });

    it('aceita chaves Symbol', () => {
        const key = Symbol('k');
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, key, 'v');
        expect(target[key]).toBe('v');
    });

    it('cria __proto__ como propriedade própria enumerável, sem trocar o protótipo', () => {
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, '__proto__', { isAdmin: true });

        expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
        expect(Object.prototype.hasOwnProperty.call(target, '__proto__')).toBe(true);
        expect(Object.keys(target)).toEqual(['__proto__']);
        expect(target.__proto__).toEqual({ isAdmin: true });
        expect((target as Record<string, unknown>).isAdmin).toBeUndefined();
    });

    it('não troca o protótipo para null via __proto__', () => {
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, '__proto__', null);

        expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
        expect(typeof target.hasOwnProperty).toBe('function');
    });

    it('permite reatribuir __proto__ (propriedade writable/configurable)', () => {
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, '__proto__', 1);
        baseAssignValue(target, '__proto__', 2);
        expect(target.__proto__).toBe(2);
    });

    it('não polui Object.prototype', () => {
        const target: Record<PropertyKey, unknown> = {};
        baseAssignValue(target, '__proto__', { poluido: true });
        expect((({}) as Record<string, unknown>).poluido).toBeUndefined();
    });
});
