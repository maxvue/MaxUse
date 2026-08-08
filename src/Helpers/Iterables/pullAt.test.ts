import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pullAt } from './pullAt';

describe('pullAt', () => {
    it('MUTA; retorna removidos', () => {
        const original = [5, 10, 15, 20];
        const removed = pullAt(original, [1, 3]);
        expect(removed).toEqual([10, 20]);
        expect(original).toEqual([5, 15]);
    });

    it('aceita um único índice numérico', () => {
        const original = [5, 10, 15];
        const removed = pullAt(original, 0);
        expect(removed).toEqual([5]);
        expect(original).toEqual([10, 15]);
    });

    it('índices duplicados retornam o valor repetido mas removem uma única vez', () => {
        const original = [10, 20, 30, 40];
        const removed = pullAt(original, [1, 1]);
        expect(removed).toEqual([20, 20]);
        expect(original).toEqual([10, 30, 40]);
    });

    it('índice fora do range retorna undefined e não altera o array', () => {
        const original = [10, 20, 30];
        const removed = pullAt(original, [5]);
        expect(removed).toEqual([undefined]);
        expect(original).toEqual([10, 20, 30]);
    });

    it('retorna array de undefined para array de entrada vazio', () => {
        expect(pullAt([], [0])).toEqual([undefined]);
    });

    it('retorna array de undefined para null', () => {
        expect(pullAt(null, [0])).toEqual([undefined]);
    });

    it('funciona com Ref', () => {
        const r = ref([1, 2, 3]);
        const removed = pullAt(r, [0]);
        expect(removed).toEqual([1]);
    });
});
