import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { maxBy } from './maxBy';

describe('maxBy', () => {
    it('retorna o elemento com o maior valor derivado por função', () => {
        expect(maxBy([{ n: 1 }, { n: 5 }, { n: 3 }], (o: { n: number }) => o.n)).toEqual({ n: 5 });
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(maxBy([{ n: 1 }, { n: 5 }, { n: 3 }], 'n')).toEqual({ n: 5 });
    });

    it('sem iterateeFn, usa identidade', () => {
        expect(maxBy([1, 5, 3])).toBe(5);
    });

    it('retorna undefined para array vazio', () => {
        expect(maxBy([], 'n')).toBeUndefined();
    });

    it('retorna undefined para array null ou undefined', () => {
        expect(maxBy(null, 'n')).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(maxBy(ref([{ n: 2 }, { n: 9 }]), 'n')).toEqual({ n: 9 });
    });
});
