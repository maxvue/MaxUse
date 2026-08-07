import { describe, it, expect } from 'vitest';
import { intersectionWith } from './intersectionWith';

const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('intersectionWith', () => {
    it('retorna elementos presentes em todos os arrays, segundo o comparator', () => {
        expect(intersectionWith([{ x: 1 }, { x: 2 }], [{ x: 1 }], isEqual)).toEqual([{ x: 1 }]);
    });

    it('sem comparator (último argumento é array), usa SameValueZero', () => {
        expect(intersectionWith([1, 2], [2, 3])).toEqual([2]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(intersectionWith()).toEqual([]);
    });
});
