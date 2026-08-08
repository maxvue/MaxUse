import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { dropRightWhile } from './dropRightWhile';

describe('dropRightWhile', () => {
    it('remove elementos do final enquanto o predicado casar', () => {
        expect(dropRightWhile([1, 2, 3, 4], (x: number) => x > 2)).toEqual([1, 2]);
    });

    it('retorna o array inteiro se o predicado nunca casar', () => {
        expect(dropRightWhile([1, 2, 3], (x: number) => x > 10)).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(dropRightWhile(null, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(dropRightWhile(ref([1, 2, 3]), (x: number) => x > 2)).toEqual([1, 2]);
    });
});
