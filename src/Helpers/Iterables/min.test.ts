import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { min } from './min';

describe('min', () => {
    it('retorna o menor valor do array', () => {
        expect(min([5, 1, 3])).toBe(1);
    });

    it('retorna undefined para array vazio', () => {
        expect(min([])).toBeUndefined();
    });

    it('retorna undefined para array null ou undefined', () => {
        expect(min(null)).toBeUndefined();
    });

    it('peculiaridade: NaN nunca vence a comparação', () => {
        expect(min([NaN, 2, 1])).toBe(1);
    });

    it('funciona com Ref', () => {
        expect(min(ref([3, 1, 2]))).toBe(1);
    });
});
