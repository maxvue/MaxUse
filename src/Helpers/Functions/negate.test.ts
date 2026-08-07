import { describe, it, expect } from 'vitest';
import { negate } from './negate';

describe('negate', () => {
    it('nega o resultado do predicado', () => {
        const isEven = (n: number) => n % 2 === 0;
        const isOdd = negate(isEven);
        expect(isOdd(3)).toBe(true);
        expect(isOdd(4)).toBe(false);
    });

    it('repassa todos os argumentos ao predicado', () => {
        const sumIsPositive = (a: number, b: number) => a + b > 0;
        const sumIsNotPositive = negate(sumIsPositive);
        expect(sumIsNotPositive(1, 2)).toBe(false);
        expect(sumIsNotPositive(-3, 1)).toBe(true);
    });

    it('lança TypeError se o argumento não for função', () => {
        expect(() => negate(null as any)).toThrow(TypeError);
        expect(() => negate(undefined as any)).toThrow(TypeError);
    });

    it('preserva o "this" na chamada', () => {
        const obj = {
            value: 5,
            isPositive(this: { value: number }) {
                return this.value > 0;
            }
        };
        const isNotPositive = negate(obj.isPositive);
        expect(isNotPositive.call(obj)).toBe(false);
    });
});
