import { describe, it, expect, vi } from 'vitest';
import { once } from './once';

describe('once', () => {
    it('invoca a função apenas uma vez', () => {
        const func = vi.fn((n: number) => n * 2);
        const single = once(func);

        expect(single(5)).toBe(10);
        expect(single(99)).toBe(10);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('primeira chamada usa os argumentos passados; chamadas seguintes são ignoradas', () => {
        const func = vi.fn((a: number, b: number) => a + b);
        const single = once(func);

        single(1, 2);
        single(100, 200);
        expect(func).toHaveBeenCalledWith(1, 2);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('repassa "this" corretamente', () => {
        const obj = {
            value: 5,
            calc(this: { value: number }, n: number) {
                return this.value + n;
            }
        };
        const single = once(obj.calc);
        expect(single.call(obj, 10)).toBe(15);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => once(null as any)).toThrow(TypeError);
    });
});
