import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sampleSize } from './sampleSize';

describe('sampleSize', () => {
    it('n clampado ao tamanho: retorna no máximo o tamanho da coleção', () => {
        expect(sampleSize([1, 2, 3], 10)).toHaveLength(3);
    });

    it('retorna n elementos únicos do array original', () => {
        const result = sampleSize([1, 2, 3], 2);
        expect(result).toHaveLength(2);
        for (const item of result) expect([1, 2, 3]).toContain(item);
        expect(new Set(result).size).toBe(2);
    });

    it('n default 1', () => {
        expect(sampleSize([1, 2, 3])).toHaveLength(1);
    });

    it('funciona com objeto, amostrando os valores', () => {
        const result = sampleSize({ a: 1, b: 2, c: 3 }, 2);
        expect(result).toHaveLength(2);
        for (const item of result) expect([1, 2, 3]).toContain(item);
    });

    it('trata n negativo como 0', () => {
        expect(sampleSize([1, 2, 3], -1)).toEqual([]);
    });

    it('retorna vazio para array vazio', () => {
        expect(sampleSize([], 2)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(sampleSize(null, 2)).toEqual([]);
    });

    it('não muta o array original', () => {
        const original = [1, 2, 3];
        sampleSize(original, 2);
        expect(original).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(sampleSize(ref([1, 2, 3]), 3)).toHaveLength(3);
    });
});
