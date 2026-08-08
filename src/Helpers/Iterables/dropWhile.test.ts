import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { dropWhile } from './dropWhile';

describe('dropWhile', () => {
    it('remove elementos do início enquanto o predicado casar', () => {
        expect(dropWhile([1, 2, 3, 4], (x: number) => x < 3)).toEqual([3, 4]);
    });

    it('retorna o array inteiro se o predicado nunca casar', () => {
        expect(dropWhile([1, 2, 3], (x: number) => x > 10)).toEqual([1, 2, 3]);
    });

    it('retorna vazio se todos os elementos casarem', () => {
        expect(dropWhile([1, 2, 3], () => true)).toEqual([]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(dropWhile(null, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(dropWhile(ref([1, 2, 3]), (x: number) => x < 2)).toEqual([2, 3]);
    });
});
