import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toFinite } from './toFinite';

describe('toFinite', () => {
    it('retorna o próprio número quando já é finito', () => {
        expect(toFinite(3.5)).toBe(3.5);
        expect(toFinite(0)).toBe(0);
    });

    it('grampeia Infinity/-Infinity em Number.MAX_VALUE (peculiaridade)', () => {
        expect(toFinite(Infinity)).toBe(Number.MAX_VALUE);
        expect(toFinite(-Infinity)).toBe(-Number.MAX_VALUE);
    });

    it('converte string numérica', () => {
        expect(toFinite('3.5')).toBe(3.5);
    });

    it('retorna 0 para NaN, null, undefined e string inválida', () => {
        expect(toFinite(NaN)).toBe(0);
        expect(toFinite(null)).toBe(0);
        expect(toFinite(undefined)).toBe(0);
        expect(toFinite('abc')).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(toFinite(ref(3.5))).toBe(3.5);
        expect(toFinite(ref(Infinity))).toBe(Number.MAX_VALUE);
    });
});
