import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { roundDown } from './roundDown';

describe('roundDown', () => {
    it('arredonda para baixo sem casas decimais', () => {
        expect(roundDown(4.9)).toBe(4);
    });

    it('arredonda para baixo com casas decimais positivas', () => {
        expect(roundDown(4.567, 2)).toBe(4.56);
    });

    it('arredonda para baixo com casas decimais negativas', () => {
        expect(roundDown(4560, -2)).toBe(4500);
    });

    it('mantém valores já exatos', () => {
        expect(roundDown(5, 2)).toBe(5);
    });

    it('funciona com número negativo', () => {
        expect(roundDown(-4.567, 2)).toBe(-4.57);
    });

    it('funciona com zero', () => {
        expect(roundDown(0, 2)).toBe(0);
    });

    it('funciona com Ref no value', () => {
        expect(roundDown(ref(4.567), 2)).toBe(4.56);
    });

    it('funciona com Ref em decimals', () => {
        expect(roundDown(4.567, ref(1))).toBe(4.5);
    });

    it('funciona com Ref em ambos os argumentos', () => {
        expect(roundDown(ref(4.567), ref(2))).toBe(4.56);
    });
});
