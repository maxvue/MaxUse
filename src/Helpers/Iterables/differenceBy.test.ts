import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { differenceBy } from './differenceBy';

describe('differenceBy', () => {
    it('exclui elementos cujo critério derivado aparece em values', () => {
        expect(differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([1.2]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(differenceBy([{ x: 1 }, { x: 2 }], [{ x: 1 }], 'x')).toEqual([{ x: 2 }]);
    });

    it('sem iteratee (último argumento é array), usa identidade', () => {
        expect(differenceBy([1, 2], [3])).toEqual([1, 2]);
        expect(differenceBy([1, 2], [2])).toEqual([1]);
    });

    it('retorna vazio para array de entrada null ou undefined', () => {
        expect(differenceBy(null, [1])).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(differenceBy(ref([2.1, 1.2]), [2.3], Math.floor)).toEqual([1.2]);
    });

    it('trata chaves NaN com SameValueZero', () => {
        expect(differenceBy([{ x: NaN }], [{ x: NaN }], 'x')).toEqual([]);
    });

    it('considera chaves -0 e +0 iguais', () => {
        expect(differenceBy([{ x: -0 }], [{ x: 0 }], 'x')).toEqual([]);
    });

    it('aceita chave objeto, comparada por referência', () => {
        const chave = { id: 1 };
        expect(differenceBy([1], [2], () => ({ id: 1 })).length).toBe(1);
        expect(differenceBy([1], [2], () => chave)).toEqual([]);
    });
});
