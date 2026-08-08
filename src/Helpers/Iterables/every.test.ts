import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { every } from './every';

describe('every', () => {
    it('retorna true quando todos os elementos casam', () => {
        expect(every([1, 2, 3], (x: number) => x > 0)).toBe(true);
    });

    it('retorna false quando algum elemento não casa', () => {
        expect(every([1, 2, 3], (x: number) => x > 1)).toBe(false);
    });

    it('funciona com objeto', () => {
        expect(every({ a: 1, b: 2 }, (x: number) => x > 0)).toBe(true);
    });

    it('coleção vazia sempre retorna true', () => {
        expect(every([], () => false)).toBe(true);
    });

    it('coleção null ou undefined retorna true', () => {
        expect(every(null, () => false)).toBe(true);
        expect(every(undefined, () => false)).toBe(true);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(every([{ a: 1 }, { a: 2 }], 'a')).toBe(true);
        expect(every([{ a: 0 }, { a: 2 }], 'a')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(every(ref([2, 4, 6]), (x: number) => x % 2 === 0)).toBe(true);
    });
});
