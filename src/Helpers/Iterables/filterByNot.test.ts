import { describe, it, expect } from 'vitest';
import { filterByNot } from './filterByNot';

describe('filterByNot', () => {
    it('remove itens por chave e valor', () => {
        const items = [{ status: 'ok' }, { status: 'error' }, { status: 'ok' }];
        const result = filterByNot(items, 'status', 'error');
        expect(result).toHaveLength(2);
    });

    it('remove itens com array de valores', () => {
        const items = [{ role: 'admin' }, { role: 'user' }, { role: 'guest' }];
        const result = filterByNot(items, 'role', ['admin', 'guest']);
        expect(result).toHaveLength(1);
        expect((result as any[])[0].role).toBe('user');
    });

    it('usa true como valor padrão', () => {
        const items = [{ deleted: true }, { deleted: false }, { deleted: true }];
        const result = filterByNot(items, 'deleted');
        expect(result).toHaveLength(1);
    });

    it('filtra Record (objeto)', () => {
        const obj = { a: { v: 1 }, b: { v: 2 } };
        const result = filterByNot(obj, 'v', 1) as Record<string, any>;
        expect(Object.keys(result)).toEqual(['b']);
    });

    it('retorna vazio para null', () => {
        expect(filterByNot(null, 'key')).toEqual([]);
    });

    it('retorna array vazio para tipos primitivos', () => {
        expect(filterByNot('string' as any, 'key')).toEqual([]);
        expect(filterByNot(42 as any, 'key')).toEqual([]);
    });
});
