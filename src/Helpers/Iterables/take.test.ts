import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { take } from './take';

describe('take', () => {
    it('n default 1', () => {
        expect(take([1, 2, 3])).toEqual([1]);
    });

    it('retorna os n primeiros elementos', () => {
        expect(take([1, 2, 3], 2)).toEqual([1, 2]);
    });

    it('retorna vazio para n=0', () => {
        expect(take([1, 2, 3], 0)).toEqual([]);
    });

    it('trata n negativo como 0', () => {
        expect(take([1, 2, 3], -1)).toEqual([]);
    });

    it('clampa quando n excede o tamanho', () => {
        expect(take([1, 2, 3], 5)).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio', () => {
        expect(take([], 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(take(null, 1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(take(ref([1, 2, 3]), 2)).toEqual([1, 2]);
    });
});
