import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { findIndex } from './findIndex';

describe('findIndex', () => {
    it('retorna o índice do primeiro elemento que casa', () => {
        expect(findIndex([1, 2, 3, 4], (x: number) => x > 2)).toBe(2);
    });

    it('retorna -1 quando nenhum elemento casa', () => {
        expect(findIndex([1, 2, 3, 4], (x: number) => x > 10)).toBe(-1);
    });

    it('fromIndex positivo além do array retorna -1', () => {
        expect(findIndex([1, 2, 3], (x: number) => x > 2, 3)).toBe(-1);
    });

    it('fromIndex negativo conta a partir do final', () => {
        expect(findIndex([1, 2, 3], (x: number) => x > 2, -1)).toBe(2);
    });

    it('fromIndex negativo além do início grampeia em 0', () => {
        expect(findIndex([1, 2, 3], (x: number) => x > 0, -10)).toBe(0);
    });

    it('retorna -1 para array null ou undefined', () => {
        expect(findIndex(null, () => true)).toBe(-1);
        expect(findIndex(undefined, () => true)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(findIndex(ref([1, 2, 3]), (x: number) => x === 3)).toBe(2);
    });
});
