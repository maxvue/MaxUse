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

    it('trata NaN com SameValueZero', () => {
        expect(xor([NaN, 1], [NaN, 2])).toEqual([1, 2]);
    });

    it('considera -0 e +0 iguais, mas preserva o sinal do valor original', () => {
        expect(xor([-0, 1], [0, 2])).toEqual([1, 2]);
        const resultado = xor([-0, 1], [2]);
        expect(Object.is(resultado[0], -0)).toBe(true);
    });

    it('compara objetos por referência, não por conteúdo', () => {
        expect(xor([{ a: 1 }], [{ a: 1 }]).length).toBe(2);
        const mesmo = { a: 1 };
        expect(xor([mesmo], [mesmo])).toEqual([]);
    });
});
