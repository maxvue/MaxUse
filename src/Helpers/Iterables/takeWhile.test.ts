import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { takeWhile } from './takeWhile';

describe('takeWhile', () => {
    it('retorna o prefixo enquanto o predicado casar', () => {
        expect(takeWhile([1, 2, 3, 4], (x: number) => x < 3)).toEqual([1, 2]);
    });

    it('retorna vazio se o predicado nunca casar', () => {
        expect(takeWhile([1, 2, 3], (x: number) => x > 10)).toEqual([]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(takeWhile(null, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(takeWhile(ref([1, 2, 3]), (x: number) => x < 2)).toEqual([1]);
    });
});
