import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findLastIndex } from './findLastIndex';

describe('findLastIndex', () => {
    it('retorna o índice do último elemento que casa', () => {
        expect(findLastIndex([1, 2, 3, 4], (x: number) => x > 2)).toBe(3);
    });

    it('busca de trás para frente a partir de fromIndex', () => {
        expect(findLastIndex([1, 2, 3], (x: number) => x > 0, 1)).toBe(1);
    });

    it('fromIndex negativo conta a partir do final', () => {
        expect(findLastIndex([1, 2, 3], (x: number) => x > 0, -1)).toBe(2);
    });

    it('fromIndex além do array grampeia em length - 1', () => {
        expect(findLastIndex([1, 2, 3], (x: number) => x > 0, 10)).toBe(2);
    });

    it('retorna -1 para array vazio', () => {
        expect(findLastIndex([], (x: number) => x > 0)).toBe(-1);
    });

    it('retorna -1 para array null ou undefined', () => {
        expect(findLastIndex(null, () => true)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(findLastIndex(ref([1, 2, 3]), (x: number) => x > 0)).toBe(2);
    });
});
