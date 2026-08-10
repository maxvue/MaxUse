import { describe, it, expect } from 'vitest';
import { deepSet } from './_deepSet';

describe('deepSet', () => {
    it('define valor em objeto plano com caminho simples ou profundo', () => {
        const obj = {};
        deepSet(obj, 'a.b.c', 42);
        expect(obj).toEqual({ a: { b: { c: 42 } } });
    });

    it('cria array intermediário quando o próximo segmento é um índice', () => {
        const obj = {};
        deepSet(obj, 'users[0].name', 'João');
        expect(obj).toEqual({ users: [{ name: 'João' }] });
    });

    it('bloqueia poluição de protótipo (__proto__, constructor, prototype)', () => {
        const obj = {};
        deepSet(obj, '__proto__.polluted', true);
        expect((Object.prototype as any).polluted).toBeUndefined();

        deepSet(obj, 'constructor.prototype.polluted', true);
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('retorna o objeto original sem alterar se for nulo ou não-objeto', () => {
        expect(deepSet(null as any, 'a', 1)).toBeNull();
        expect(deepSet(123 as any, 'a', 1)).toBe(123);
    });
});
