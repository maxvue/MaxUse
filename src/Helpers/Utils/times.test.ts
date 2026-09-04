import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { times } from './times';

describe('times', () => {
    it('invoca iteratee n vezes, passando o índice', () => {
        expect(times(3, String)).toEqual(['0', '1', '2']);
    });

    it('sem iteratee, retorna os índices (peculiaridade)', () => {
        expect(times(3)).toEqual([0, 1, 2]);
    });

    it('retorna array vazio para n <= 0', () => {
        expect(times(0)).toEqual([]);
        expect(times(-1)).toEqual([]);
    });

    it('retorna array vazio para n acima de MAX_SAFE_INTEGER (guarda de limite)', () => {
        expect(times(Number.MAX_SAFE_INTEGER + 1)).toEqual([]);
    });

    it('trunca n fracionário', () => {
        expect(times(2.5)).toEqual([0, 1]);
    });

    it('funciona com Ref', () => {
        expect(times(ref(3))).toEqual([0, 1, 2]);
    });

    it('não invoca iteratee além do limite quando count <= 2 * maxArrayLength (contrato Lodash)', () => {
        let extraCalls = 0;
        // Com limite reduzido M = 10 e count = 20: Lodash executa baseTimes(10) e 0 chamadas no while
        times(20, (i) => {
            if (i >= 10) extraCalls++;
        }, 10);
        expect(extraCalls).toBe(0);
    });

    it('invoca iteratee com limites e índices corretos quando count > 2 * maxArrayLength (contrato Lodash)', () => {
        const extraIndices: number[] = [];
        // Com limite reduzido M = 10 e count = 25: remaining = 15; while (++index < 15) com index iniciando em 10 -> índices 11 a 14 (4 chamadas)
        times(25, (i) => {
            if (i >= 10) extraIndices.push(i);
        }, 10);
        expect(extraIndices).toEqual([11, 12, 13, 14]);
    });
});
