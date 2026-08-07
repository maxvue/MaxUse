import { describe, it, expect } from 'vitest';
import { xorWith } from './xorWith';

const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('xorWith', () => {
    it('retorna elementos presentes em exatamente um array, segundo o comparator', () => {
        expect(xorWith([{ x: 1 }], [{ x: 1 }, { x: 2 }], isEqual)).toEqual([{ x: 2 }]);
    });

    it('sem comparator (último argumento é array), usa SameValueZero', () => {
        expect(xorWith([1, 2], [2, 3])).toEqual([1, 3]);
    });
});
