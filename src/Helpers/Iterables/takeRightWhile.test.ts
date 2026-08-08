import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { takeRightWhile } from './takeRightWhile';

describe('takeRightWhile', () => {
    it('retorna o sufixo enquanto o predicado casar', () => {
        expect(takeRightWhile([1, 2, 3, 4], (x: number) => x > 2)).toEqual([3, 4]);
    });

    it('retorna vazio se o predicado nunca casar', () => {
        expect(takeRightWhile([1, 2, 3], (x: number) => x > 10)).toEqual([]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(takeRightWhile(null, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(takeRightWhile(ref([1, 2, 3]), (x: number) => x > 1)).toEqual([2, 3]);
    });
});
