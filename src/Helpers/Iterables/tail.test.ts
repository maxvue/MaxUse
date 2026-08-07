import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { tail } from './tail';

describe('tail', () => {
    it('retorna todos exceto o primeiro', () => {
        expect(tail([1, 2, 3])).toEqual([2, 3]);
    });

    it('retorna vazio para array de 1 elemento', () => {
        expect(tail([1])).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(tail([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(tail(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(tail(undefined)).toEqual([]);
    });

    it('não muta o array original', () => {
        const original = [1, 2, 3];
        tail(original);
        expect(original).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(tail(ref([1, 2, 3]))).toEqual([2, 3]);
    });
});
