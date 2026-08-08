import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isFunction } from './isFunction';

describe('isFunction', () => {
    it('retorna true para função comum', () => {
        expect(isFunction(function foo() {})).toBe(true);
        expect(isFunction(() => {})).toBe(true);
    });

    it('true para async/generator/proxy de função', () => {
        expect(isFunction(async () => {})).toBe(true);
        expect(isFunction(function* () {})).toBe(true);
        expect(isFunction(new Proxy(() => {}, {}))).toBe(true);
    });

    it('retorna false para outros tipos', () => {
        expect(isFunction(null)).toBe(false);
        expect(isFunction(undefined)).toBe(false);
        expect(isFunction('abc')).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction(/abc/)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isFunction(ref(() => {}))).toBe(true);
        expect(isFunction(ref(1))).toBe(false);
    });
});
