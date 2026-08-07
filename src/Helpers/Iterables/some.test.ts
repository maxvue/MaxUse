import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { some } from './some';

describe('some', () => {
    it('retorna true quando algum elemento casa', () => {
        expect(some([1, 2, 3], (x: number) => x > 2)).toBe(true);
    });

    it('retorna false quando nenhum elemento casa', () => {
        expect(some([1, 2, 3], (x: number) => x > 10)).toBe(false);
    });

    it('coleção vazia sempre retorna false', () => {
        expect(some([], () => true)).toBe(false);
    });

    it('coleção null ou undefined retorna false', () => {
        expect(some(null, () => true)).toBe(false);
        expect(some(undefined, () => true)).toBe(false);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(some([{ a: 0 }, { a: 2 }], 'a')).toBe(true);
        expect(some([{ a: 0 }, { a: 0 }], 'a')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(some(ref([1, 3, 5]), (x: number) => x % 2 === 0)).toBe(false);
    });
});
