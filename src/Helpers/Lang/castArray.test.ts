import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { castArray } from './castArray';

describe('castArray', () => {
    it('envolve valor não-array em um array', () => {
        expect(castArray(1)).toEqual([1]);
        expect(castArray('a')).toEqual(['a']);
    });

    it('retorna o próprio array quando já é um array', () => {
        expect(castArray([1, 2])).toEqual([1, 2]);
    });

    it('retorna array vazio quando chamado sem argumentos (peculiaridade)', () => {
        expect(castArray()).toEqual([]);
    });

    it('envolve null e undefined em array (quando passados explicitamente)', () => {
        expect(castArray(null)).toEqual([null]);
        expect(castArray(undefined)).toEqual([undefined]);
    });

    it('funciona com Ref', () => {
        expect(castArray(ref(1))).toEqual([1]);
        expect(castArray(ref([1, 2]))).toEqual([1, 2]);
    });
});
