import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isWeakSet } from './isWeakSet';

describe('isWeakSet', () => {
    it('retorna true para WeakSet', () => {
        expect(isWeakSet(new WeakSet())).toBe(true);
    });

    it('retorna false para Set (peculiaridade: não confundir com WeakSet)', () => {
        expect(isWeakSet(new Set())).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isWeakSet(null)).toBe(false);
        expect(isWeakSet(undefined)).toBe(false);
        expect(isWeakSet({})).toBe(false);
    });

    it('funciona com Ref', () => {
        const ws = new WeakSet();
        expect(isWeakSet(ref(ws))).toBe(true);
        expect(isWeakSet(ref(1))).toBe(false);
    });
});
