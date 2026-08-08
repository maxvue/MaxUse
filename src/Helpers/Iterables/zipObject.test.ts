import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { zipObject } from './zipObject';

describe('zipObject', () => {
    it('monta objeto a partir de chaves e valores', () => {
        expect(zipObject(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
    });

    it('preenche com undefined quando faltam valores', () => {
        expect(zipObject(['a', 'b'], [1])).toEqual({ a: 1, b: undefined });
    });

    it('retorna vazio quando props é vazio', () => {
        expect(zipObject([], [1, 2])).toEqual({});
    });

    it('retorna vazio para null', () => {
        expect(zipObject(null, null)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(zipObject(ref(['x']), ref([1]))).toEqual({ x: 1 });
    });
});
