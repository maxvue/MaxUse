import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isWeakMap } from './isWeakMap';

describe('isWeakMap', () => {
    it('retorna true para WeakMap', () => {
        expect(isWeakMap(new WeakMap())).toBe(true);
    });

    it('retorna false para Map (peculiaridade: não confundir com WeakMap)', () => {
        expect(isWeakMap(new Map())).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isWeakMap(null)).toBe(false);
        expect(isWeakMap(undefined)).toBe(false);
        expect(isWeakMap({})).toBe(false);
    });

    it('funciona com Ref', () => {
        const wm = new WeakMap();
        expect(isWeakMap(ref(wm))).toBe(true);
        expect(isWeakMap(ref(1))).toBe(false);
    });
});
