import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pull } from './pull';

describe('pull', () => {
    it('remove todas as ocorrências dos valores', () => {
        expect(pull([1, 2, 3, 1, 2, 3], 2, 3)).toEqual([1, 1]);
    });

    it('MUTA o array', () => {
        const original = [1, 2, 3, 1, 2, 3];
        const result = pull(original, 2, 3);
        expect(result).toBe(original);
        expect(original).toEqual([1, 1]);
    });

    it('usa SameValueZero: remove NaN', () => {
        expect(pull([1, NaN, 2], NaN)).toEqual([1, 2]);
    });

    it('retorna o array original quando não há values', () => {
        expect(pull([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('retorna null para null', () => {
        expect(pull(null, 1)).toBeNull();
    });

    it('funciona com array vazio', () => {
        expect(pull([], 1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        const r = ref([1, 2, 3]);
        expect(pull(r, 2)).toEqual([1, 3]);
    });
});
