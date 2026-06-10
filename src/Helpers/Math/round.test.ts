import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { roundUp } from './roundUp';
import { roundDown } from './roundDown';

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
