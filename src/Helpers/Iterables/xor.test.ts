import { describe, it, expect } from 'vitest';
import { xor } from './xor';

describe('xor', () => {
    it('diferença simétrica entre dois arrays', () => {
        expect(xor([2, 1], [2, 3])).toEqual([1, 3]);
    });

    it('valor presente em todos os arrays é excluído', () => {
        expect(xor([1], [1], [1])).toEqual([]);
    });

    it('múltiplos arrays: mantém apenas quem aparece em exatamente um', () => {
        expect(xor([2, 1], [2, 3], [1, 4])).toEqual([3, 4]);
    });

    it('usa SameValueZero: trata NaN corretamente', () => {
        expect(xor([1, NaN], [NaN, 2])).toEqual([1, 2]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(xor()).toEqual([]);
    });

    it('array único retorna seus valores sem duplicatas', () => {
        expect(xor([2, 1, 2])).toEqual([2, 1]);
    });

    it('ignora argumentos não array', () => {
        expect(xor([1, 2], 'a' as unknown as number[])).toEqual([1, 2]);
    });
});
