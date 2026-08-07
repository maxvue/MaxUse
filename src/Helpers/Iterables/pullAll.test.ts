import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pullAll } from './pullAll';

describe('pullAll', () => {
    it('remove todas as ocorrências dos valores', () => {
        expect(pullAll([1, 2, 3, 1, 2, 3], [2, 3])).toEqual([1, 1]);
    });

    it('MUTA o array', () => {
        const original = [1, 2, 3, 1, 2, 3];
        const result = pullAll(original, [2, 3]);
        expect(result).toBe(original);
        expect(original).toEqual([1, 1]);
    });

    it('usa SameValueZero: remove NaN', () => {
        expect(pullAll([1, NaN, 2], [NaN])).toEqual([1, 2]);
    });

    it('retorna o array original quando values é vazio', () => {
        expect(pullAll([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it('retorna o array original quando values é null', () => {
        expect(pullAll([1, 2, 3], null)).toEqual([1, 2, 3]);
    });

    it('retorna null para array null', () => {
        expect(pullAll(null, [1])).toBeNull();
    });

    it('funciona com Ref', () => {
        const r = ref([1, 2, 3]);
        expect(pullAll(r, [2])).toEqual([1, 3]);
    });
});
