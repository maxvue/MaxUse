import { describe, it, expect } from 'vitest';
import { baseGet } from './_baseGet';

describe('baseGet', () => {
    it('obtem valor em caminho simples ou aninhado', () => {
        const obj = { a: { b: { c: 100 } } };
        expect(baseGet(obj, 'a.b.c')).toBe(100);
        expect(baseGet(obj, ['a', 'b', 'c'])).toBe(100);
    });

    it('retorna undefined para caminhos que nao existem', () => {
        const obj = { a: { b: 1 } };
        expect(baseGet(obj, 'a.c')).toBeUndefined();
        expect(baseGet(null, 'a.b')).toBeUndefined();
    });
});
