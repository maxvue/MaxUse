import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { size } from './size';

describe('size', () => {
    it('retorna tamanho de array', () => {
        expect(size([1, 2, 3])).toBe(3);
    });

    it('retorna tamanho de string', () => {
        expect(size('hello')).toBe(5);
    });

    it('retorna número de chaves de objeto', () => {
        expect(size({ a: 1, b: 2 })).toBe(2);
    });

    it('retorna tamanho de Map', () => {
        expect(size(new Map([['a', 1], ['b', 2]]))).toBe(2);
    });

    it('retorna tamanho de Set', () => {
        expect(size(new Set([1, 2, 3]))).toBe(3);
    });

    it('retorna o próprio número quando allow_number=true (padrão)', () => {
        expect(size(42)).toBe(42);
    });

    it('retorna 0 para número quando allow_number=false', () => {
        expect(size(42, false)).toBe(0);
    });

    it('retorna 0 para null', () => {
        expect(size(null)).toBe(0);
    });

    it('retorna 0 para undefined', () => {
        expect(size(undefined)).toBe(0);
    });

    it('retorna 0 para string vazia (isBlank)', () => {
        expect(size('')).toBe(0);
    });

    it('retorna 0 para objeto vazio', () => {
        expect(size({})).toBe(0);
    });

    it('retorna 0 para array vazio', () => {
        expect(size([])).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(size(ref([1, 2]))).toBe(2);
    });

    it('retorna 0 quando toValue(value) é null', () => {
        expect(size(ref(null))).toBe(0);
    });
});
