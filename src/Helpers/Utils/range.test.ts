import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { range } from './range';

describe('range', () => {
    it('gera intervalo de 0 até o limite quando chamado com um argumento (peculiaridade)', () => {
        expect(range(4)).toEqual([0, 1, 2, 3]);
    });

    it('gera intervalo negativo automaticamente com um argumento negativo', () => {
        expect(range(-4)).toEqual([0, -1, -2, -3]);
    });

    it('gera intervalo entre start e end', () => {
        expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('aceita step customizado', () => {
        expect(range(0, 20, 5)).toEqual([0, 5, 10, 15]);
        expect(range(0, -4, -1)).toEqual([0, -1, -2, -3]);
    });

    it('step 0 gera array repetindo start (peculiaridade)', () => {
        expect(range(1, 4, 0)).toEqual([1, 1, 1]);
    });

    it('retorna array vazio quando start igual a end', () => {
        expect(range(0)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(range(ref(1), ref(4))).toEqual([1, 2, 3]);
    });
});
