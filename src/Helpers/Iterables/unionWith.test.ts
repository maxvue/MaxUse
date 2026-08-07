import { describe, it, expect } from 'vitest';
import { unionWith } from './unionWith';

const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('unionWith', () => {
    it('une arrays sem duplicatas segundo o comparator', () => {
        expect(unionWith([{ x: 1 }], [{ x: 1 }, { x: 2 }], isEqual)).toEqual([{ x: 1 }, { x: 2 }]);
    });

    it('sem comparator (último argumento é array), usa SameValueZero', () => {
        expect(unionWith([1], [1, 2])).toEqual([1, 2]);
    });
});
