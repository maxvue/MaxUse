import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isBoolean } from './isBoolean';

describe('isBoolean', () => {
    it('retorna true para true e false', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
    });

    it('retorna true para objeto Boolean', () => {

        expect(isBoolean(new Boolean(true))).toBe(true);
    });

    it('retorna false para outros tipos', () => {
        expect(isBoolean(null)).toBe(false);
        expect(isBoolean(undefined)).toBe(false);
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean('true')).toBe(false);
        expect(isBoolean([])).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isBoolean(ref(true))).toBe(true);
        expect(isBoolean(ref(1))).toBe(false);
    });
});
