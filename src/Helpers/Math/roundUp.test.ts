import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { roundUp } from './roundUp';

describe('roundUp', () => {
    it('arredonda para cima sem casas decimais', () => {
        expect(roundUp(4.1)).toBe(5);
    });

    it('arredonda para cima com casas decimais positivas', () => {
        expect(roundUp(4.561, 2)).toBe(4.57);
    });

    it('arredonda para cima com casas decimais negativas', () => {
        expect(roundUp(4510, -2)).toBe(4600);
    });

    it('mantém valores já exatos', () => {
        expect(roundUp(5, 2)).toBe(5);
    });

    it('funciona com número negativo', () => {
        expect(roundUp(-4.567, 2)).toBe(-4.56);
    });

    it('funciona com zero', () => {
        expect(roundUp(0, 2)).toBe(0);
    });

    it('funciona com Ref no value', () => {
        expect(roundUp(ref(4.561), 2)).toBe(4.57);
    });

    it('funciona com Ref em decimals', () => {
        expect(roundUp(4.561, ref(1))).toBe(4.6);
    });

    it('funciona com Ref em ambos os argumentos', () => {
        expect(roundUp(ref(4.561), ref(2))).toBe(4.57);
    });
});
