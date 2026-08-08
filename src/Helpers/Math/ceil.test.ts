import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { ceil } from './ceil';

describe('ceil', () => {
    it('arredonda para cima sem precisão', () => {
        expect(ceil(4.006)).toBe(5);
    });

    it('arredonda para cima com precisão positiva', () => {
        expect(ceil(6.004, 2)).toBe(6.01);
    });

    it('arredonda para cima com precisão negativa (peculiaridade)', () => {
        expect(ceil(6040, -2)).toBe(6100);
    });

    it('funciona com Ref', () => {
        expect(ceil(ref(4.006))).toBe(5);
    });

    it('limita precisão a 292 casas decimais sem lançar erro (guarda de cap)', () => {
        expect(ceil(4.006, 500)).toBe(4.006);
    });

    it('trunca precisão fracionária para inteiro antes de usar (peculiaridade)', () => {
        expect(ceil(4006, -2.7)).toBe(4100);
    });
});
