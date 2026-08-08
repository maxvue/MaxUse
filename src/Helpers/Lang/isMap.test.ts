import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isMap } from './isMap';

describe('isMap', () => {
    it('retorna true para Map', () => {
        expect(isMap(new Map())).toBe(true);
    });

    it('retorna false para WeakMap (peculiaridade: não confundir com Map)', () => {
        expect(isMap(new WeakMap())).toBe(false);
    });

    it('retorna false para outros tipos', () => {
        expect(isMap(null)).toBe(false);
        expect(isMap(undefined)).toBe(false);
        expect(isMap(new Set())).toBe(false);
        expect(isMap({})).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isMap(ref(new Map()))).toBe(true);
        expect(isMap(ref(1))).toBe(false);
    });
});
