import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { concat } from './concat';

describe('concat', () => {
    it('concatena arrays', () => {
        expect(concat<number | number[]>([1], [2], [[3]])).toEqual([1, 2, [3]]);
    });

    it('concatena valores soltos', () => {
        expect(concat([1, 2], 3, 4)).toEqual([1, 2, 3, 4]);
    });

    it('não muta o array original', () => {
        const original = [1, 2];
        const result = concat(original, [3]);
        expect(original).toEqual([1, 2]);
        expect(result).toEqual([1, 2, 3]);
        expect(result).not.toBe(original);
    });

    it('achata apenas 1 nível de arrays passados', () => {
        expect(concat<number | Array<number | number[]>>([1], [[2, [3]]])).toEqual([1, [2, [3]]]);
    });

    it('funciona com array vazio', () => {
        expect(concat([])).toEqual([]);
    });

    it('funciona quando base não é array', () => {
        expect(concat(1 as any, 2, 3)).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(concat(ref([1, 2]), 3)).toEqual([1, 2, 3]);
    });
});
