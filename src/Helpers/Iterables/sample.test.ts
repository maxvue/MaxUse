import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sample } from './sample';

describe('sample', () => {
    it('retorna um item do array', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(arr).toContain(sample(arr));
    });

    it('retorna undefined para null', () => {
        expect(sample(null)).toBeUndefined();
    });

    it('retorna undefined para array vazio', () => {
        expect(sample([])).toBeUndefined();
    });

    it('funciona com Record (objeto)', () => {
        const obj = { a: 10, b: 20, c: 30 };
        const result = sample(obj);
        expect([10, 20, 30]).toContain(result);
    });

    it('funciona com Ref', () => {
        const arr = ref([42]);
        expect(sample(arr)).toBe(42);
    });
});
