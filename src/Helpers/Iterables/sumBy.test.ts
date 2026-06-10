import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sumBy } from './sumBy';

describe('sumBy', () => {
    it('soma por string key', () => {
        const items = [{ v: 10 }, { v: 20 }, { v: 30 }];
        expect(sumBy(items, 'v')).toBe(60);
    });

    it('retorna 0 para null', () => {
        expect(sumBy(null, 'v')).toBe(0);
    });

    it('soma Record (objeto de objetos)', () => {
        const obj = { a: { v: 5 }, b: { v: 15 } };
        expect(sumBy(obj, 'v')).toBe(20);
    });

    it('ignora valores não numéricos', () => {
        const items = [{ v: 10 }, { v: 'abc' }, { v: 5 }];
        expect(sumBy(items, 'v')).toBe(15);
    });

    it('funciona com Ref', () => {
        expect(sumBy(ref([{ v: 3 }, { v: 7 }]), 'v')).toBe(10);
    });
});
