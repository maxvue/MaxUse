import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { unzipWith } from './unzipWith';

describe('unzipWith', () => {
    it('transpõe e combina os grupos', () => {
        expect(unzipWith([[1, 10], [2, 20]], (a: number | undefined, b: number | undefined) => (a ?? 0) + (b ?? 0))).toEqual([3, 30]);
    });

    it('sem combineFn, comporta-se como unzip', () => {
        expect(unzipWith([[1, 10], [2, 20]])).toEqual([[1, 2], [10, 20]]);
    });

    it('retorna vazio para array vazio', () => {
        expect(unzipWith([])).toEqual([]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(unzipWith(null)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(unzipWith(ref([[1, 10], [2, 20]]), (a: number | undefined, b: number | undefined) => (a ?? 0) + (b ?? 0))).toEqual([3, 30]);
    });
});
