import { describe, it, expect, vi } from 'vitest';
import { memoize } from './memoize';

describe('memoize', () => {
    it('memoriza o resultado usando o primeiro argumento como chave', () => {
        const func = vi.fn((n: number) => n * 2);
        const memoized = memoize(func);

        expect(memoized(5)).toBe(10);
        expect(memoized(5)).toBe(10);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('chama a função original de novo para uma chave diferente', () => {
        const func = vi.fn((n: number) => n * 2);
        const memoized = memoize(func);

        memoized(1);
        memoized(2);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('usa resolver para calcular a chave', () => {
        const func = vi.fn((a: number, b: number) => a + b);
        const resolver = (a: number, b: number) => `${a}-${b}`;
        const memoized = memoize(func, resolver);

        expect(memoized(1, 2)).toBe(3);
        expect(memoized(1, 2)).toBe(3);
        expect(func).toHaveBeenCalledTimes(1);

        memoized(2, 1);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('expõe .cache como Map manipulável', () => {
        const func = vi.fn((n: number) => n * 2);
        const memoized = memoize(func);

        memoized(1);
        expect(memoized.cache.has(1)).toBe(true);
        memoized.cache.delete(1);
        expect(memoized.cache.has(1)).toBe(false);

        memoized(1);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('cache.clear() limpa todas as entradas', () => {
        const func = vi.fn((n: number) => n * 2);
        const memoized = memoize(func);

        memoized(1);
        memoized(2);
        memoized.cache.clear();
        expect(memoized.cache.size).toBe(0);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => memoize(null as any)).toThrow(TypeError);
    });

    it('lança TypeError se resolver não for função', () => {
        expect(() => memoize(() => 1, 'x' as any)).toThrow(TypeError);
    });

    it('preserva "this" na chamada memorizada', () => {
        const obj = {
            value: 10,
            calc(this: { value: number }, n: number) {
                return this.value + n;
            }
        };
        const memoized = memoize(obj.calc);
        expect(memoized.call(obj, 5)).toBe(15);
    });

    it('expõe memoize.Cache', () => {
        expect(memoize.Cache).toBe(Map);
    });
});
