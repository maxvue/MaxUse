import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { rangeRight } from './rangeRight';

describe('rangeRight', () => {
    it('gera os mesmos valores de range, mas na ordem inversa (peculiaridade)', () => {
        expect(rangeRight(4)).toEqual([3, 2, 1, 0]);
    });

    it('aceita step customizado', () => {
        expect(rangeRight(0, 20, 5)).toEqual([15, 10, 5, 0]);
    });

    it('retorna array vazio quando start igual a end', () => {
        expect(rangeRight(0)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(rangeRight(ref(1), ref(4))).toEqual([3, 2, 1]);
    });
});
