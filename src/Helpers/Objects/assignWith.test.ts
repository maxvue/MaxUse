import { describe, it, expect } from 'vitest';
import { assignWith } from './assignWith';

describe('assignWith', () => {
    it('usa customizer para decidir o valor atribuído', () => {
        const customizer = (objValue: unknown, srcValue: unknown) => (objValue === undefined ? srcValue : objValue);
        expect(assignWith({ a: 1 }, { a: 2, b: 3 }, customizer)).toEqual({ a: 1, b: 3 });
    });

    it('customizer retornando undefined cai no comportamento padrão', () => {
        const customizer = () => undefined;
        expect(assignWith({ a: 1 }, { b: 2 }, customizer)).toEqual({ a: 1, b: 2 });
    });

    it('aplica múltiplas fontes antes do customizer', () => {
        const customizer = (objValue: unknown, srcValue: unknown) => (objValue === undefined ? srcValue : objValue);
        expect(assignWith({ a: 1 }, { b: 2 }, { c: 3 }, customizer)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('peculiaridade: sem customizer (todos os argumentos são fontes), atribui normalmente', () => {
        expect(assignWith({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('não troca o protótipo do objeto retornado via chave __proto__', () => {
        const payload = JSON.parse('{"__proto__":{"isAdmin":true}}');
        const result = assignWith({}, payload) as Record<string, unknown>;

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(result.isAdmin).toBeUndefined();
        expect(({} as Record<string, unknown>).isAdmin).toBeUndefined();
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    });
});
