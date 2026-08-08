import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isSet } from './isSet';

describe('isSet', () => {
    it('retorna true para Set', () => {
        expect(isSet(new Set())).toBe(true);
    });

    it('retorna false para WeakSet (peculiaridade: não confundir com Set)', () => {
        expect(isSet(new WeakSet())).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isSet(null)).toBe(false);
        expect(isSet(undefined)).toBe(false);
        expect(isSet(new Map())).toBe(false);
        expect(isSet([])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isSet(ref(new Set()))).toBe(true);
        expect(isSet(ref(1))).toBe(false);
    });
});
