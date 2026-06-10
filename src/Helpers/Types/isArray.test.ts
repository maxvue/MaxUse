import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isArray } from './isArray';

describe('isArray', () => {
    it('retorna true para array vazio', () => {
        expect(isArray([])).toBe(true);
    });

    it('retorna true para array com itens', () => {
        expect(isArray([1, 2, 3])).toBe(true);
    });

    it('retorna false para objeto', () => {
        expect(isArray({})).toBe(false);
    });

    it('retorna false para string', () => {
        expect(isArray('hello')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isArray(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(isArray(undefined)).toBe(false);
    });

    it('retorna false para número', () => {
        expect(isArray(42)).toBe(false);
    });

    it('retorna false para Map', () => {
        expect(isArray(new Map())).toBe(false);
    });

    it('retorna false para Set', () => {
        expect(isArray(new Set())).toBe(false);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(isArray(ref([1, 2]))).toBe(true);
        expect(isArray(ref({}))).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(isArray(() => [1])).toBe(true);
        expect(isArray(() => 'not array')).toBe(false);
    });
});
