import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { minBy } from './minBy';

describe('minBy', () => {
    it('retorna o elemento com o menor valor derivado por função', () => {
        expect(minBy([{ n: 5 }, { n: 1 }, { n: 3 }], (o: { n: number }) => o.n)).toEqual({ n: 1 });
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(minBy([{ n: 5 }, { n: 1 }], 'n')).toEqual({ n: 1 });
    });

    it('retorna undefined para array vazio', () => {
        expect(minBy([], 'n')).toBeUndefined();
    });

    it('retorna undefined para array null ou undefined', () => {
        expect(minBy(null, 'n')).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(minBy(ref([{ n: 9 }, { n: 2 }]), 'n')).toEqual({ n: 2 });
    });
});
