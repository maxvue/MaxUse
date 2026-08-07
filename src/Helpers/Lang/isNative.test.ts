import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNative } from './isNative';

describe('isNative', () => {
    it('retorna true para funções nativas do motor JS', () => {
        expect(isNative(Array.prototype.push)).toBe(true);
        expect(isNative(Math.max)).toBe(true);
    });

    it('retorna true para função bound (código nativo de Function.prototype.bind)', () => {
        expect(isNative(function () {}.bind(null))).toBe(true);
    });

    it('retorna false para função escrita em JS puro', () => {
        expect(isNative(function foo() {})).toBe(false);
        expect(isNative(() => {})).toBe(false);
    });

    it('não lança em ambientes com polyfills/masking, apenas retorna false para não-nativas (peculiaridade: Lodash lança nesse caso, esta implementação não)', () => {
        const maskedLike = function () { return 1; };
        expect(() => isNative(maskedLike)).not.toThrow();
        expect(isNative(maskedLike)).toBe(false);
    });

    it('retorna false para não-função', () => {
        expect(isNative(null)).toBe(false);
        expect(isNative(undefined)).toBe(false);
        expect(isNative({})).toBe(false);
        expect(isNative('abc')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isNative(ref(Math.max))).toBe(true);
        expect(isNative(ref(() => {}))).toBe(false);
    });
});
