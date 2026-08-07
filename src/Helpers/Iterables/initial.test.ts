import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { initial } from './initial';

describe('initial', () => {
    it('retorna todos exceto o último', () => {
        expect(initial([1, 2, 3])).toEqual([1, 2]);
    });

    it('retorna vazio para array de 1 elemento', () => {
        expect(initial([1])).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(initial([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(initial(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(initial(undefined)).toEqual([]);
    });

    it('não muta o array original', () => {
        const original = [1, 2, 3];
        initial(original);
        expect(original).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(initial(ref([1, 2, 3]))).toEqual([1, 2]);
    });
});
