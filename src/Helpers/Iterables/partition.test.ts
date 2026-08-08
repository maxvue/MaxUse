import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { partition } from './partition';

describe('partition', () => {
    it('divide o array em [casaram, não casaram]', () => {
        expect(partition([1, 2, 3, 4], (x: number) => x % 2 === 0)).toEqual([[2, 4], [1, 3]]);
    });

    it('funciona com objeto', () => {
        expect(partition({ a: 1, b: 2 }, (x: number) => x > 1)).toEqual([[2], [1]]);
    });

    it('coleção vazia retorna dois arrays vazios', () => {
        expect(partition([], () => true)).toEqual([[], []]);
    });

    it('coleção null ou undefined retorna dois arrays vazios', () => {
        expect(partition(null, () => true)).toEqual([[], []]);
        expect(partition(undefined, () => true)).toEqual([[], []]);
    });

    it('funciona com Ref', () => {
        expect(partition(ref([1, 2, 3]), (x: number) => x > 1)).toEqual([[2, 3], [1]]);
    });
});
