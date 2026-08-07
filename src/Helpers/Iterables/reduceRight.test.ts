import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { reduceRight } from './reduceRight';

describe('reduceRight', () => {
    it('reduz na ordem inversa, concatenando da direita para a esquerda', () => {
        expect(reduceRight([1, 2, 3], (acc: string, v: number) => acc + v, '')).toBe('321');
    });

    it('sem valor inicial, usa o último elemento como acumulador', () => {
        expect(reduceRight(['a', 'b', 'c'], (acc: string, v: string) => acc + v)).toBe('cba');
    });

    it('coleção null com valor inicial retorna o valor inicial', () => {
        expect(reduceRight(null, (acc: number, v: number) => acc + v, 5)).toBe(5);
    });

    it('array vazio sem valor inicial retorna undefined', () => {
        expect(reduceRight([], (acc: number, v: number) => acc + v)).toBeUndefined();
    });

    it('funciona com objeto, dobrando pelas chaves na ordem inversa', () => {
        expect(reduceRight({ a: 1, b: 2 }, (acc: string, v: number, k: number | string) => acc + k + v, '')).toBe('b2a1');
    });

    it('funciona com Ref', () => {
        expect(reduceRight(ref([1, 2, 3]), (acc: number, v: number) => acc + v, 10)).toBe(16);
    });
});
