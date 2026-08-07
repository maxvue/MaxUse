import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isSymbol } from './isSymbol';

describe('isSymbol', () => {
    it('retorna true para symbol primitivo', () => {
        expect(isSymbol(Symbol('a'))).toBe(true);
        expect(isSymbol(Symbol.iterator)).toBe(true);
    });

    it('retorna true para objeto Symbol via Object()', () => {
        expect(isSymbol(Object(Symbol('a')))).toBe(true);
    });

    it('retorna false para outros tipos', () => {
        expect(isSymbol(null)).toBe(false);
        expect(isSymbol(undefined)).toBe(false);
        expect(isSymbol('a')).toBe(false);
        expect(isSymbol(1)).toBe(false);
        expect(isSymbol({})).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isSymbol(ref(Symbol('a')))).toBe(true);
        expect(isSymbol(ref(1))).toBe(false);
    });
});
