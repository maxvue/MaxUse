import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { uniqBy } from './uniqBy';

describe('uniqBy', () => {
    it('remove duplicatas segundo o valor derivado pela função', () => {
        expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(uniqBy([{ n: 'a' }, { n: 'b' }, { n: 'a' }], 'n')).toEqual([{ n: 'a' }, { n: 'b' }]);
    });

    it('mantém a primeira ocorrência de cada critério', () => {
        expect(uniqBy([{ id: 1, v: 'x' }, { id: 1, v: 'y' }], 'id')).toEqual([{ id: 1, v: 'x' }]);
    });

    it('retorna vazio para array vazio, null ou undefined', () => {
        expect(uniqBy([])).toEqual([]);
        expect(uniqBy(null)).toEqual([]);
        expect(uniqBy(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(uniqBy(ref([1.1, 1.9, 2.5]), Math.floor)).toEqual([1.1, 2.5]);
    });
});
