import { describe, it, expect } from 'vitest';
import { negate } from './negate';

describe('negate', () => {
    it('inverte o resultado do predicado', () => {
        const isPar = (n: number) => n % 2 === 0;
        expect(negate(isPar)(2)).toBe(false);
        expect(negate(isPar)(3)).toBe(true);
    });

    it('repassa todos os argumentos e o this', () => {
        const fn = negate(function (this: { base: number }, a: number, b: number) {
            return a + b > this.base;
        });
        expect(fn.call({ base: 10 }, 2, 3)).toBe(true);
    });
});
