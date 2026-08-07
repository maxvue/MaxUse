import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { reverse } from './reverse';

describe('reverse', () => {
    it('inverte a ordem dos elementos', () => {
        expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
    });

    it('MUTA o array (igual Array#reverse)', () => {
        const original = [1, 2, 3];
        const result = reverse(original);
        expect(result).toBe(original);
        expect(original).toEqual([3, 2, 1]);
    });

    it('retorna null para null', () => {
        expect(reverse(null)).toBeNull();
    });

    it('retorna undefined para undefined', () => {
        expect(reverse(undefined)).toBeUndefined();
    });

    it('funciona com array vazio', () => {
        expect(reverse([])).toEqual([]);
    });

    it('funciona com Ref', () => {
        const r = ref([1, 2, 3]);
        expect(reverse(r)).toEqual([3, 2, 1]);
    });
});
