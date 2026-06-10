import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { median } from './median';

describe('median', () => {
    it('calcula mediana de array ímpar (elemento central)', () => {
        expect(median([1, 3, 5])).toBe(3);
    });

    it('calcula mediana de array par (média dos 2 centrais)', () => {
        expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it('retorna 0 para array vazio', () => {
        expect(median([])).toBe(0);
    });

    it('retorna o próprio valor para array unitário', () => {
        expect(median([42])).toBe(42);
    });

    it('ordena antes de calcular (entrada desordenada)', () => {
        expect(median([5, 1, 3])).toBe(3);
    });

    it('não modifica o array original', () => {
        const arr = [3, 1, 2];
        median(arr);
        expect(arr).toEqual([3, 1, 2]);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(median(ref([10, 20, 30]))).toBe(20);
    });
});
