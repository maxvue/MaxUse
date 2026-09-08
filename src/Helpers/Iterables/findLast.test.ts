import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findLast } from './findLast';

describe('findLast', () => {
    it('encontra o último item que atende ao predicado', () => {
        const items = [1, 2, 3, 4, 5];
        const result = findLast(items, (n) => n < 4);
        expect(result).toBe(3);
    });

    it('retorna undefined quando nenhum item atende', () => {
        expect(findLast([1, 2, 3], (n) => n > 10)).toBeUndefined();
    });

    it('retorna undefined para null', () => {
        expect(findLast(null, () => true)).toBeUndefined();
    });

    it('funciona com objetos', () => {
        const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'A' }];
        const result = findLast(items, (i) => i.name === 'A');
        expect(result?.id).toBe(3);
    });

    it('funciona com Ref', () => {
        const result = findLast(ref([10, 20, 30, 40]), (n) => n < 25);
        expect(result).toBe(20);
    });

    it('encontra o último por property shorthand', () => {
        const result = findLast([{ a: 0 }, { a: 1 }, { a: 2 }], 'a');
        expect(result).toEqual({ a: 2 });
    });

    it('encontra o último por matches object shorthand', () => {
        const items = [{ id: 1, tag: 'x' }, { id: 2, tag: 'y' }, { id: 3, tag: 'x' }];
        const result = findLast(items, { tag: 'x' });
        expect(result).toEqual({ id: 3, tag: 'x' });
    });

    it('encontra o último por matchesProperty array shorthand', () => {
        const items = [{ id: 1, ok: true }, { id: 2, ok: true }];
        const result = findLast(items, ['id', 1]);
        expect(result).toEqual({ id: 1, ok: true });
    });

    it('suporta Record como input', () => {
        const dict = { a: { id: 1, v: 'x' }, b: { id: 2, v: 'x' } };
        const result = findLast(dict, ['v', 'x']);
        expect(result).toEqual({ id: 2, v: 'x' });
    });

    it('suporta fromIndex backward', () => {
        const items = [{ id: 1, tag: 'x' }, { id: 2, tag: 'x' }, { id: 3, tag: 'x' }];
        const result = findLast(items, { tag: 'x' }, 1);
        expect(result).toEqual({ id: 2, tag: 'x' });
    });
});
