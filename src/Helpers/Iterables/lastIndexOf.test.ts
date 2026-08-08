import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lastIndexOf } from './lastIndexOf';

describe('lastIndexOf', () => {
    it('retorna o último índice do valor', () => {
        expect(lastIndexOf([1, 2, 1, 2], 2)).toBe(3);
    });

    it('respeita fromIndex buscando de trás para frente', () => {
        expect(lastIndexOf([1, 2, 1, 2], 2, 2)).toBe(1);
    });

    it('encontra NaN', () => {
        expect(lastIndexOf([1, 2, NaN], NaN)).toBe(2);
    });

    it('fromIndex negativo conta do fim', () => {
        expect(lastIndexOf([1, 2, 1, 2], 1, -2)).toBe(2);
    });

    it('retorna -1 quando não encontra', () => {
        expect(lastIndexOf([1, 2, 3], 5)).toBe(-1);
    });

    it('retorna -1 para array vazio', () => {
        expect(lastIndexOf([], 1)).toBe(-1);
    });

    it('retorna -1 para null', () => {
        expect(lastIndexOf(null, 1)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(lastIndexOf(ref([1, 2, 1]), 1)).toBe(2);
    });
});
