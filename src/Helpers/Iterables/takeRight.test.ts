import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { takeRight } from './takeRight';

describe('takeRight', () => {
    it('n default 1', () => {
        expect(takeRight([1, 2, 3])).toEqual([3]);
    });

    it('retorna os n últimos elementos', () => {
        expect(takeRight([1, 2, 3], 2)).toEqual([2, 3]);
    });

    it('retorna vazio para n=0', () => {
        expect(takeRight([1, 2, 3], 0)).toEqual([]);
    });

    it('trata n negativo como 0', () => {
        expect(takeRight([1, 2, 3], -1)).toEqual([]);
    });

    it('clampa quando n excede o tamanho', () => {
        expect(takeRight([1, 2, 3], 5)).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio', () => {
        expect(takeRight([], 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(takeRight(null, 1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(takeRight(ref([1, 2, 3]), 2)).toEqual([2, 3]);
    });
});
