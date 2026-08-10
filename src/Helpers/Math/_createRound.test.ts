import { describe, it, expect } from 'vitest';
import { createRound } from './_createRound';

describe('createRound', () => {
    it('arredonda números com precisão positiva sem erros de ponto flutuante', () => {
        expect(createRound(1.005, 2, Math.round)).toBe(1.01);
        expect(createRound(4.006, 2, Math.floor)).toBe(4);
        expect(createRound(4.006, 2, Math.ceil)).toBe(4.01);
    });

    it('arredonda números com precisão negativa (à esquerda da vírgula)', () => {
        expect(createRound(1234, -2, Math.round)).toBe(1200);
    });

    it('retorna resultado direto quando precisão é 0 ou invalida', () => {
        expect(createRound(4.6, 0, Math.round)).toBe(5);
        expect(createRound(4.6, NaN, Math.round)).toBe(5);
    });
});
