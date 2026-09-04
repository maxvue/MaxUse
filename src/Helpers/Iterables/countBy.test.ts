import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { countBy } from './countBy';

describe('countBy', () => {
    it('agrupa e conta ocorrências aplicando iteratee função (Lodash spec)', () => {
        expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': 1, '6': 2 });
    });

    it('agrupa e conta ocorrências usando iteratee por chave/propriedade string', () => {
        expect(countBy(['one', 'two', 'three'], 'length')).toEqual({ '3': 2, '5': 1 });
    });

    it('usa a identidade quando o iteratee é omitido', () => {
        expect(countBy(['a', 'b', 'a'])).toEqual({ a: 2, b: 1 });
    });

    it('aceita o atalho [caminho, valor]', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countBy(items, ['status', 'ok'])).toEqual({ true: 2, false: 1 });
    });

    it('aceita o atalho de objeto', () => {
        const items = [{ status: 'ok' }, { status: 'ok' }, { status: 'error' }];
        expect(countBy(items, { status: 'ok' })).toEqual({ true: 2, false: 1 });
    });

    it('retorna objeto vazio para null ou undefined', () => {
        expect(countBy(null)).toEqual({});
        expect(countBy(undefined)).toEqual({});
        expect(countBy(null, 'active')).toEqual({});
    });

    it('funciona com Record (object)', () => {
        const items = { a: { tipo: 'x' }, b: { tipo: 'y' }, c: { tipo: 'x' } };
        expect(countBy(items, 'tipo')).toEqual({ x: 2, y: 1 });
    });

    it('desembrulha refs na coleção', () => {
        const items = ref([{ tipo: 'x' }, { tipo: 'x' }]);
        expect(countBy(items, 'tipo')).toEqual({ x: 2 });
    });

    it('retorna objeto vazio para coleção vazia', () => {
        expect(countBy([])).toEqual({});
    });
});

