import { describe, it, expect } from 'vitest';
import { intersection } from './intersection';

describe('intersection', () => {
    it('retorna valores presentes em todos os arrays', () => {
        expect(intersection([2, 1], [4, 2, 1])).toEqual([2, 1]);
    });

    it('remove duplicatas do resultado', () => {
        expect(intersection([2, 1, 2], [2, 3])).toEqual([2]);
    });

    it('usa SameValueZero: intersecciona NaN', () => {
        expect(intersection([NaN, 1], [NaN, 2])).toEqual([NaN]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(intersection()).toEqual([]);
    });

    it('argumento não array é tratado como array vazio, esvaziando o resultado', () => {
        expect(intersection([2, 1], 'a' as unknown as number[])).toEqual([]);
    });

    it('retorna vazio quando não há interseção', () => {
        expect(intersection([1, 2], [3, 4])).toEqual([]);
    });
});
