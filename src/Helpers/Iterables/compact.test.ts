import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { compact } from './compact';

describe('compact', () => {
    it('remove elementos falsy', () => {
        expect(compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]);
    });

    it('remove false, null, 0, "", undefined, NaN', () => {
        expect(compact([false, null, 0, '', undefined, NaN, 1, 'a'])).toEqual([1, 'a']);
    });

    it('retorna vazio para array vazio', () => {
        expect(compact([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(compact(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(compact(undefined)).toEqual([]);
    });

    it('preserva elementos truthy como objetos e arrays vazios', () => {
        const obj = {};
        const arr: unknown[] = [];
        expect(compact([obj, arr, 'x'])).toEqual([obj, arr, 'x']);
    });

    it('funciona com Ref', () => {
        expect(compact(ref([0, 1, false, 2]))).toEqual([1, 2]);
    });
});
