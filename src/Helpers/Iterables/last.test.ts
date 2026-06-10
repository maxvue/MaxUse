import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { last } from './last';

describe('last', () => {
    it('retorna último item', () => {
        expect(last([10, 20, 30])).toBe(30);
    });

    it('retorna undefined para null', () => {
        expect(last(null)).toBeUndefined();
    });

    it('retorna undefined para array vazio', () => {
        expect(last([])).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(last(ref([5, 10]))).toBe(10);
    });
});
