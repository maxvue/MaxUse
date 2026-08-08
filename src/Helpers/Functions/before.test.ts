import { describe, it, expect, vi } from 'vitest';
import { before } from './before';

describe('before', () => {
    it('invoca a função até n - 1 chamadas', () => {
        const func = vi.fn((n: number) => n * 2);
        const limited = before(3, func);

        expect(limited(1)).toBe(2);
        expect(limited(2)).toBe(4);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('a partir da n-ésima chamada, retorna o último resultado sem invocar de novo', () => {
        const func = vi.fn((n: number) => n * 2);
        const limited = before(3, func);

        limited(1);
        limited(2);
        const third = limited(99);
        expect(third).toBe(4);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('n = 1 nunca invoca a função', () => {
        const func = vi.fn(() => 'x');
        const limited = before(1, func);
        expect(limited()).toBeUndefined();
        expect(func).not.toHaveBeenCalled();
    });

    it('lança TypeError se func não for função', () => {
        expect(() => before(1, null as any)).toThrow(TypeError);
    });

    it('repassa argumentos e "this"', () => {
        const func = vi.fn(function (this: any, a: number) {
            return a + (this?.offset ?? 0);
        });
        const obj = { offset: 10, limited: before(2, func) };
        expect(obj.limited(5)).toBe(15);
    });
});
