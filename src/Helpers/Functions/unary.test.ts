import { describe, it, expect } from 'vitest';
import { unary } from './unary';

describe('unary', () => {
    it('limita a função a um único argumento', () => {
        const results = ['6', '8', '10'].map(unary(parseInt));
        expect(results).toEqual([6, 8, 10]);
    });

    it('não repassa segundo argumento', () => {
        const func = (a: number, b?: number) => ({ a, b });
        const single = unary(func) as (...args: unknown[]) => { a: number; b?: number };
        expect(single(1, 2)).toEqual({ a: 1, b: undefined });
    });

    it('lança TypeError se func não for função', () => {
        expect(() => unary(null as any)).toThrow(TypeError);
    });
});
