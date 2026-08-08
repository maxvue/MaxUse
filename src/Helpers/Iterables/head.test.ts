import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { head } from './head';

describe('head', () => {
    it('retorna o primeiro elemento', () => {
        expect(head([1, 2, 3])).toBe(1);
    });

    it('retorna undefined para array vazio', () => {
        expect(head([])).toBeUndefined();
    });

    it('retorna undefined para null', () => {
        expect(head(null)).toBeUndefined();
    });

    it('retorna undefined para undefined', () => {
        expect(head(undefined)).toBeUndefined();
    });

    it('preserva elemento falsy como primeiro', () => {
        expect(head([0, 1, 2])).toBe(0);
        expect(head([false, true])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(head(ref([1, 2, 3]))).toBe(1);
    });
});
