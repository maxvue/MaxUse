import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { meanBy } from './meanBy';

describe('meanBy', () => {
    it('calcula a média dos valores derivados por função', () => {
        expect(meanBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], (o: { n: number }) => o.n)).toBe(5);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(meanBy([{ n: 1 }, { n: 2 }, { n: 3 }], 'n')).toBe(2);
    });

    it('retorna NaN para array vazio', () => {
        expect(meanBy([], 'n')).toBeNaN();
    });

    it('retorna NaN para array null ou undefined', () => {
        expect(meanBy(null, 'n')).toBeNaN();
    });

    it('funciona com Ref', () => {
        expect(meanBy(ref([{ n: 2 }, { n: 4 }]), 'n')).toBe(3);
    });
});
