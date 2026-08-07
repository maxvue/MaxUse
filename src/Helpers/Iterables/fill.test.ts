import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { fill } from './fill';

describe('fill', () => {
    it('preenche todo o array por padrão', () => {
        expect(fill([1, 2, 3], 'x')).toEqual(['x', 'x', 'x']);
    });

    it('MUTA o array', () => {
        const original = [1, 2, 3];
        const result = fill(original, 'x');
        expect(result).toBe(original as unknown as (string | number)[]);
        expect(original).toEqual(['x', 'x', 'x']);
    });

    it('preenche a partir de start', () => {
        expect(fill([1, 2, 3], 'x', 1)).toEqual([1, 'x', 'x']);
    });

    it('preenche entre start e end', () => {
        expect(fill([1, 2, 3], 'x', 1, 2)).toEqual([1, 'x', 3]);
    });

    it('aceita índices negativos', () => {
        expect(fill([1, 2, 3, 4], 'x', -2, -1)).toEqual([1, 2, 'x', 4]);
        expect(fill([1, 2, 3, 4], 'x', -2)).toEqual([1, 2, 'x', 'x']);
    });

    it('clampa índices fora do range', () => {
        expect(fill([1, 2, 3], 'x', -100, 100)).toEqual(['x', 'x', 'x']);
    });

    it('retorna vazio para array vazio', () => {
        expect(fill([], 'x')).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(fill(null, 'x')).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(fill(ref([1, 2, 3]), 0)).toEqual([0, 0, 0]);
    });
});
