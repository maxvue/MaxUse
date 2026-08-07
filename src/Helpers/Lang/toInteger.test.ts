import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toInteger } from './toInteger';

describe('toInteger', () => {
    it('trunca a parte fracionária', () => {
        expect(toInteger(3.5)).toBe(3);
        expect(toInteger(-3.5)).toBe(-3);
    });

    it('grampeia Infinity em Number.MAX_VALUE (herdado de toFinite)', () => {
        expect(toInteger(Infinity)).toBe(Number.MAX_VALUE);
    });

    it('retorna 0 para null, undefined e NaN', () => {
        expect(toInteger(null)).toBe(0);
        expect(toInteger(undefined)).toBe(0);
        expect(toInteger(NaN)).toBe(0);
    });

    it('funciona com Ref', () => {
        expect(toInteger(ref(3.9))).toBe(3);
        expect(toInteger(ref(-3.9))).toBe(-3);
    });
});
