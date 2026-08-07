import { describe, it, expect } from 'vitest';
import { flip } from './flip';

describe('flip', () => {
    it('inverte a ordem dos argumentos', () => {
        const subtract = (a: number, b: number) => a - b;
        const flipped = flip(subtract);
        expect(flipped(1, 10)).toBe(9);
    });

    it('funciona com número variável de argumentos', () => {
        const list = (...args: number[]) => args;
        const flipped = flip(list);
        expect(flipped(1, 2, 3)).toEqual([3, 2, 1]);
    });

    it('sem argumentos, retorna array vazio invertido (sem erro)', () => {
        const list = (...args: number[]) => args;
        const flipped = flip(list);
        expect(flipped()).toEqual([]);
    });

    it('preserva "this"', () => {
        const obj = {
            value: 10,
            calc(this: { value: number }, a: number, b: number) {
                return this.value + a - b;
            }
        };
        const flipped = flip(obj.calc);
        expect(flipped.call(obj, 1, 5)).toBe(14);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => flip(null as any)).toThrow(TypeError);
    });
});
