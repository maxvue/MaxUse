import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { indexOf } from './indexOf';

describe('indexOf', () => {
    it('retorna o índice do valor', () => {
        expect(indexOf([1, 2, 3], 2)).toBe(1);
    });

    it('encontra NaN (diferente de Array#indexOf nativo)', () => {
        expect(indexOf([1, 2, NaN, 3], NaN)).toBe(2);
    });

    it('fromIndex negativo conta do fim', () => {
        expect(indexOf([1, 2, 3], 2, -2)).toBe(1);
    });

    it('retorna -1 quando não encontra', () => {
        expect(indexOf([1, 2, 3], 5)).toBe(-1);
    });

    it('retorna -1 para array vazio', () => {
        expect(indexOf([], 1)).toBe(-1);
    });

    it('retorna -1 para null', () => {
        expect(indexOf(null, 1)).toBe(-1);
    });

    it('funciona com Ref', () => {
        expect(indexOf(ref([1, 2, 3]), 3)).toBe(2);
    });
});
