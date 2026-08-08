import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { roundUp } from './roundUp';
import { roundDown } from './roundDown';
import { round } from './round';

describe('roundUp', () => {
    it('arredonda para cima sem casas decimais', () => {
        expect(roundUp(4.3)).toBe(5);
    });

    it('arredonda para cima com 2 casas decimais', () => {
        expect(roundUp(4.123, 2)).toBe(4.13);
    });

    it('mantém inteiros intactos', () => {
        expect(roundUp(5)).toBe(5);
    });

    it('arredonda negativos para cima (em direção a 0)', () => {
        expect(roundUp(-4.7)).toBe(-4);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(roundUp(ref(3.14), ref(1))).toBe(3.2);
    });
});

describe('roundDown', () => {
    it('arredonda para baixo sem casas decimais', () => {
        expect(roundDown(4.9)).toBe(4);
    });

    it('arredonda para baixo com 2 casas decimais', () => {
        expect(roundDown(4.129, 2)).toBe(4.12);
    });

    it('mantém inteiros intactos', () => {
        expect(roundDown(5)).toBe(5);
    });

    it('arredonda negativos para baixo (longe de 0)', () => {
        expect(roundDown(-4.1)).toBe(-5);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(roundDown(ref(3.99), ref(1))).toBe(3.9);
    });
});

describe('round (Lodash)', () => {
    it('arredonda sem precisão', () => {
        expect(round(4.006)).toBe(4);
        expect(round(4.5)).toBe(5);
    });

    it('arredonda com precisão positiva', () => {
        expect(round(4.006, 2)).toBe(4.01);
    });

    it('arredonda com precisão negativa (peculiaridade)', () => {
        expect(round(4060, -2)).toBe(4100);
    });

    it('funciona com Ref', () => {
        expect(round(ref(4.5))).toBe(5);
    });

    it('limita precisão a 292 casas decimais sem lançar erro (guarda de cap)', () => {
        expect(round(4.006, 292)).toBe(4.006);
        expect(round(4.006, 500)).toBe(4.006);
        expect(round(4.006, 1e6)).toBe(4.006);
    });

    it('trunca precisão fracionária para inteiro antes de usar (peculiaridade)', () => {
        expect(round(1.005, 2.7)).toBe(1.01);
    });

    it('trata precisão NaN como 0 (peculiaridade)', () => {
        expect(round(1.005, NaN)).toBe(1);
    });
});
