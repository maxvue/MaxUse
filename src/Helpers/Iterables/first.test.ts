import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { first } from './first';

describe('first', () => {
    it('retorna primeiro item', () => {
        expect(first([10, 20, 30])).toBe(10);
    });

    it('retorna undefined para null', () => {
        expect(first(null)).toBeUndefined();
    });

    it('retorna undefined para array vazio', () => {
        expect(first([])).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(first(ref([5, 10]))).toBe(5);
    });
});
