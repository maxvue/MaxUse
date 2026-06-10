import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { canIterate, isIterable } from './canIterate';

describe('canIterate', () => {
    it('retorna true para array', () => {
        expect(canIterate([1, 2, 3])).toBe(true);
    });

    it('retorna true para array vazio', () => {
        expect(canIterate([])).toBe(true);
    });

    it('retorna true para string', () => {
        expect(canIterate('hello')).toBe(true);
    });

    it('retorna true para Map', () => {
        expect(canIterate(new Map())).toBe(true);
    });

    it('retorna true para Set', () => {
        expect(canIterate(new Set())).toBe(true);
    });

    it('retorna false para objeto literal (não é iterável por padrão)', () => {
        expect(canIterate({})).toBe(false);
    });

    it('retorna false para número', () => {
        expect(canIterate(42)).toBe(false);
    });

    it('retorna false para null', () => {
        expect(canIterate(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(canIterate(undefined)).toBe(false);
    });

    it('retorna false para boolean', () => {
        expect(canIterate(true)).toBe(false);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(canIterate(ref([1, 2]))).toBe(true);
        expect(canIterate(ref(42))).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(canIterate(() => 'texto')).toBe(true);
        expect(canIterate(() => null)).toBe(false);
    });
});

describe('isIterable (alias)', () => {
    it('é funcional como alias de canIterate', () => {
        expect(isIterable([1])).toBe(true);
        expect(isIterable(42)).toBe(false);
    });
});
