import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { differenceWith } from './differenceWith';

const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('differenceWith', () => {
    it('exclui elementos que casam segundo o comparator', () => {
        expect(differenceWith([{ x: 1 }, { x: 2 }], [{ x: 1 }], isEqual)).toEqual([{ x: 2 }]);
    });

    it('sem comparator (último argumento é array), usa SameValueZero', () => {
        expect(differenceWith([1, 2], [1])).toEqual([2]);
    });

    it('retorna vazio para array de entrada null ou undefined', () => {
        expect(differenceWith(null, [1])).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(differenceWith(ref([{ x: 1 }, { x: 2 }]), [{ x: 1 }], isEqual)).toEqual([{ x: 2 }]);
    });
});
