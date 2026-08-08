import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isFinite } from './isFinite';

describe('isFinite', () => {
    it('retorna true para número finito', () => {
        expect(isFinite(3)).toBe(true);
        expect(isFinite(0)).toBe(true);
        expect(isFinite(-3.5)).toBe(true);
    });

    it('retorna false para string numérica (peculiaridade: não coage como o isFinite global)', () => {
        expect(isFinite('3')).toBe(false);
    });

    it('retorna false para Infinity e NaN', () => {
        expect(isFinite(Infinity)).toBe(false);
        expect(isFinite(-Infinity)).toBe(false);
        expect(isFinite(NaN)).toBe(false);
    });

    it('retorna false para null e undefined', () => {
        expect(isFinite(null)).toBe(false);
        expect(isFinite(undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isFinite(ref(3))).toBe(true);
        expect(isFinite(ref('3'))).toBe(false);
    });
});
