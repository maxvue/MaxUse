import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { uniqWith } from './uniqWith';

describe('uniqWith', () => {
    it('remove duplicatas segundo o comparator customizado', () => {
        const eq = (a: { a: number }, b: { a: number }) => a.a === b.a;
        expect(uniqWith([{ a: 1 }, { a: 1 }, { a: 2 }], eq)).toEqual([{ a: 1 }, { a: 2 }]);
    });

    it('mantém a primeira ocorrência', () => {
        const eq = (a: number, b: number) => a === b;
        expect(uniqWith([1, 2, 1, 3], eq)).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio, null ou undefined', () => {
        const eq = () => true;
        expect(uniqWith([], eq)).toEqual([]);
        expect(uniqWith(null, eq)).toEqual([]);
    });

    it('funciona com Ref', () => {
        const eq = (a: number, b: number) => a === b;
        expect(uniqWith(ref([1, 1, 2]), eq)).toEqual([1, 2]);
    });
});
