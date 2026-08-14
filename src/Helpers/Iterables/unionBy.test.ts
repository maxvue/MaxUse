import { describe, it, expect } from 'vitest';
import { unionBy } from './unionBy';

describe('unionBy', () => {
    it('une arrays sem duplicatas segundo o critério derivado', () => {
        expect(unionBy([2.1], [1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }, { x: 2 }]);
    });

    it('sem iteratee (último argumento é array), usa identidade', () => {
        expect(unionBy([1], [2])).toEqual([1, 2]);
    });

    it('mantém o valor da primeira ocorrência do critério', () => {
        const result = unionBy([{ x: 1, tag: 'first' }], [{ x: 1, tag: 'second' }], 'x');
        expect(result).toEqual([{ x: 1, tag: 'first' }]);
    });

    it('trata chaves NaN com SameValueZero, sem duplicar', () => {
        expect(unionBy([{ x: NaN }], [{ x: NaN }], 'x').length).toBe(1);
    });

    it('considera chaves -0 e +0 iguais', () => {
        expect(unionBy([{ x: -0 }], [{ x: 0 }], 'x').length).toBe(1);
    });

    it('aceita chave objeto, comparada por referência', () => {
        const chave = { id: 1 };
        expect(unionBy([1], [2], () => ({ id: 1 })).length).toBe(2);
        expect(unionBy([1], [2], () => chave).length).toBe(1);
    });

    it('invoca o iteratee uma vez por elemento', () => {
        let chamadas = 0;
        unionBy([1, 2, 3], [3, 4], (value: number) => {
            chamadas++;
            return value;
        });
        expect(chamadas).toBe(5);
    });
});
