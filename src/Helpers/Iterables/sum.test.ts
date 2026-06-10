import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sum } from './sum';

describe('sum', () => {
    it('soma array de números', () => {
        expect(sum([1, 2, 3])).toBe(6);
    });

    it('retorna 0 para null', () => {
        expect(sum(null)).toBe(0);
    });

    it('soma Record (objeto com valores numéricos)', () => {
        expect(sum({ a: 10, b: 20 })).toBe(30);
    });

    it('ignora valores não numéricos (NaN → 0)', () => {
        expect(sum([1, 'abc', 3])).toBe(4);
    });

    it('funciona com Ref', () => {
        expect(sum(ref([10, 20]))).toBe(30);
    });
});
