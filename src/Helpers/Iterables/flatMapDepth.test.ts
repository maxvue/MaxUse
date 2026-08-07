import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { flatMapDepth } from './flatMapDepth';

describe('flatMapDepth', () => {
    it('mapeia e achata até a profundidade informada', () => {
        expect(flatMapDepth([1, 2], (x: number) => [[x, [x * 2]]], 2)).toEqual([1, [2], 2, [4]]);
    });

    it('sem depth, achata apenas 1 nível (profundidade padrão)', () => {
        expect(flatMapDepth([1, 2], (x: number) => [[x, [x * 2]]])).toEqual([[1, [2]], [2, [4]]]);
    });

    it('retorna vazio para coleção null ou undefined', () => {
        expect(flatMapDepth(null, (x: unknown) => x)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(flatMapDepth(ref([1]), (x: number) => [[x]], 2)).toEqual([1]);
    });
});
