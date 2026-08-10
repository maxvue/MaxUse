import { describe, it, expect } from 'vitest';
import { baseSet } from './_baseSet';

describe('baseSet', () => {
    it('define valor em objeto com caminho simples e aninhado', () => {
        const obj = {};
        baseSet(obj, 'a.b', 123);
        expect(obj).toEqual({ a: { b: 123 } });
    });

    it('bloqueia poluição de protótipo', () => {
        const obj = {};
        baseSet(obj, '__proto__.polluted', true);
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('usa customizer para alterar estruturas intermediárias', () => {
        const obj = {};
        baseSet(obj, 'a.b', 99, (nsValue) => nsValue ?? {});
        expect(obj).toEqual({ a: { b: 99 } });
    });
});
