import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { difference } from './difference';

describe('difference', () => {
    it('remove os valores presentes em values', () => {
        expect(difference([2, 1], [2, 3])).toEqual([1]);
    });

    it('aceita múltiplos arrays de values', () => {
        expect(difference([2, 1], [2, 3], [1])).toEqual([]);
    });

    it('usa SameValueZero: remove NaN', () => {
        expect(difference([NaN, 1], [NaN])).toEqual([1]);
    });

    it('achata apenas os arrays de values passados como argumentos separados, não elementos aninhados dentro deles', () => {
        expect(difference([1, 2, 3], [1], [2])).toEqual([3]);
        expect(difference([1, 2, 3], [1, 2])).toEqual([3]);
        expect(difference<number | number[]>([1, 2, 3], [[2]])).toEqual([1, 2, 3]);
    });

    it('retorna vazio para array vazio', () => {
        expect(difference([], [1])).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(difference(null, [1])).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(difference(ref([1, 2, 3]), [2])).toEqual([1, 3]);
    });

    it('trata NaN com SameValueZero', () => {
        expect(difference([NaN, 1], [NaN])).toEqual([1]);
    });

    it('considera -0 e +0 iguais', () => {
        expect(difference([-0, 1], [0])).toEqual([1]);
    });

    it('compara objetos por referência, não por conteúdo', () => {
        expect(difference([{ a: 1 }], [{ a: 1 }]).length).toBe(1);
        const mesmo = { a: 1 };
        expect(difference([mesmo], [mesmo])).toEqual([]);
    });
});
