import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { filterBy } from './filterBy';

describe('filterBy', () => {
    it('filtra array por chave e valor', () => {
        const items = [{ status: 'active' }, { status: 'inactive' }, { status: 'active' }];
        const result = filterBy(items, 'status', 'active');
        expect(result).toHaveLength(2);
    });

    it('usa true como valor padrão', () => {
        const items = [{ visible: true }, { visible: false }, { visible: true }];
        const result = filterBy(items, 'visible');
        expect(result).toHaveLength(2);
    });

    it('filtra Record (objeto) mantendo entradas correspondentes', () => {
        const obj = { a: { role: 'admin' }, b: { role: 'user' }, c: { role: 'admin' } };
        const result = filterBy(obj, 'role', 'admin') as Record<string, any>;
        expect(Object.keys(result)).toEqual(['a', 'c']);
    });

    it('retorna array vazio para null', () => {
        expect(filterBy(null, 'key')).toEqual([]);
    });

    it('retorna array vazio para undefined', () => {
        expect(filterBy(undefined, 'key')).toEqual([]);
    });

    it('funciona com Ref', () => {
        const items = ref([{ ok: true }, { ok: false }]);
        const result = filterBy(items, 'ok');
        expect(result).toHaveLength(1);
    });
});
