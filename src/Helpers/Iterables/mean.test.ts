import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { mean } from './mean';

describe('mean', () => {
    it('calcula a média aritmética', () => {
        expect(mean([1, 2, 3, 4])).toBe(2.5);
    });

    it('retorna NaN para array vazio', () => {
        expect(mean([])).toBeNaN();
    });

    it('retorna NaN para array null ou undefined', () => {
        expect(mean(null)).toBeNaN();
        expect(mean(undefined)).toBeNaN();
    });

    it('funciona com Ref', () => {
        expect(mean(ref([2, 4, 6]))).toBe(4);
    });
});
