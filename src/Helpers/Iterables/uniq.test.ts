import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { uniq } from './uniq';

describe('uniq', () => {
    it('remove duplicatas de primitivos', () => {
        expect(uniq([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('mantém a ordem', () => {
        expect(uniq([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });

    it('retorna array vazio para null', () => {
        expect(uniq(null)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(uniq(ref([1, 1, 2]))).toEqual([1, 2]);
    });
});
