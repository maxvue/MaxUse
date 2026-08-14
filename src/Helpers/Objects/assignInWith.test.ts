import { describe, it, expect } from 'vitest';
import { assignInWith } from './assignInWith';

describe('assignInWith', () => {
    it('usa customizer e inclui propriedades herdadas', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const customizer = (objValue: unknown, srcValue: unknown) => (objValue === undefined ? srcValue : objValue);
        const result = assignInWith({}, new (Foo as unknown as new () => { a: number; b?: number })(), customizer);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('peculiaridade: sem customizer (todos os argumentos são fontes), atribui normalmente', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        expect(assignInWith({}, new (Foo as unknown as new () => { a: number })())).toEqual({ a: 1, b: 2 });
    });

    it('não troca o protótipo do objeto retornado via chave __proto__', () => {
        const payload = JSON.parse('{"__proto__":{"isAdmin":true}}');
        const result = assignInWith({}, payload) as Record<string, unknown>;

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(result.isAdmin).toBeUndefined();
        expect(({} as Record<string, unknown>).isAdmin).toBeUndefined();
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    });
});
