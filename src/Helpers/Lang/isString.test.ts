import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isString } from './isString';

describe('isString', () => {
    it('retorna true para string primitiva', () => {
        expect(isString('abc')).toBe(true);
        expect(isString('')).toBe(true);
    });

    it('aceita objeto String', () => {

        expect(isString(new String('abc'))).toBe(true);
    });

    it('retorna false para outros tipos', () => {
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(123)).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString(['a'])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isString(ref('abc'))).toBe(true);
        expect(isString(ref(1))).toBe(false);
    });
});
