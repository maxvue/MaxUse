import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { unzip } from './unzip';

describe('unzip', () => {
    it('transpõe grupos', () => {
        expect(unzip([['a', 1, true], ['b', 2, false]])).toEqual([['a', 'b'], [1, 2], [true, false]]);
    });

    it('usa o comprimento do maior grupo', () => {
        expect(unzip([['a'], ['b', 2, 3]])).toEqual([['a', 'b'], [undefined, 2], [undefined, 3]]);
    });

    it('ignora grupos que são strings (array-like, mas não array-like object)', () => {
        expect(unzip(['ab', 'cd'] as unknown as string[][])).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(unzip([])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(unzip(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(unzip(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(unzip(ref([[1, 2], [3, 4]]))).toEqual([[1, 3], [2, 4]]);
    });
});
