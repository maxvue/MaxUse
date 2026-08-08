import { describe, it, expect } from 'vitest';
import { union } from './union';

describe('union', () => {
    it('une arrays sem duplicatas', () => {
        expect(union([2], [1, 2])).toEqual([2, 1]);
    });

    it('usa SameValueZero: deduplica NaN', () => {
        expect(union([NaN], [NaN, 1])).toEqual([NaN, 1]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(union()).toEqual([]);
    });

    it('ignora argumentos não array', () => {
        expect(union([2, 1], 'a' as unknown as number[])).toEqual([2, 1]);
    });

    it('funciona com um único array', () => {
        expect(union([1, 1, 2])).toEqual([1, 2]);
    });
});
