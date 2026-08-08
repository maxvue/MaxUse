import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { max } from './max';

describe('max', () => {
    it('retorna o maior valor do array', () => {
        expect(max([1, 5, 3])).toBe(5);
    });

    it('retorna undefined para array vazio', () => {
        expect(max([])).toBeUndefined();
    });

    it('retorna undefined para array null ou undefined', () => {
        expect(max(null)).toBeUndefined();
        expect(max(undefined)).toBeUndefined();
    });

    it('compara strings lexicograficamente', () => {
        expect(max(['a', 'bb', 'c'])).toBe('c');
    });

    it('peculiaridade: NaN nunca vence a comparação', () => {
        expect(max([NaN, 1, 2])).toBe(2);
    });

    it('peculiaridade: Symbol nunca vence a comparação', () => {
        const sym = Symbol('x');
        expect(max([sym as unknown as number, 1])).toBe(1);
    });

    it('funciona com Ref', () => {
        expect(max(ref([3, 1, 2]))).toBe(3);
    });
});
