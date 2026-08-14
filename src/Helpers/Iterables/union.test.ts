import { describe, it, expect } from 'vitest';
import { union } from './union';

describe('union', () => {
    it('une arrays sem duplicatas', () => {
        expect(union([2], [1, 2])).toEqual([2, 1]);
    });

    it('usa SameValueZero: deduplica NaN', () => {
        expect(union([NaN], [NaN, 1])).toEqual([NaN, 1]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(union()).toEqual([]);
    });

    it('ignora argumentos não array', () => {
        expect(union([2, 1], 'a' as unknown as number[])).toEqual([2, 1]);
    });

    it('funciona com um único array', () => {
        expect(union([1, 1, 2])).toEqual([1, 2]);
    });

    it('trata NaN com SameValueZero, sem duplicar', () => {
        const resultado = union([NaN, 1], [NaN, 2]);
        expect(resultado.length).toBe(3);
        expect(Number.isNaN(resultado[0])).toBe(true);
    });

    it('considera -0 e +0 iguais, mas preserva o sinal do valor original', () => {
        const resultado = union([-0], [0]);
        expect(resultado.length).toBe(1);
        expect(Object.is(resultado[0], -0)).toBe(true);
    });

    it('compara objetos por referência, não por conteúdo', () => {
        expect(union([{ a: 1 }], [{ a: 1 }]).length).toBe(2);
        const mesmo = { a: 1 };
        expect(union([mesmo], [mesmo]).length).toBe(1);
    });
});
