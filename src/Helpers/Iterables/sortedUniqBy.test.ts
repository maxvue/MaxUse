import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { sortedUniqBy } from './sortedUniqBy';

describe('sortedUniqBy', () => {
    it('remove duplicatas consecutivas por critério derivado', () => {
        expect(sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor)).toEqual([1.1, 2.3]);
    });

    it('retorna vazio para array vazio, null ou undefined', () => {
        expect(sortedUniqBy([])).toEqual([]);
        expect(sortedUniqBy(null)).toEqual([]);
    });

    it('não remove duplicatas não-consecutivas (assume array já ordenado)', () => {
        expect(sortedUniqBy([1, 2, 1], Math.floor)).toEqual([1, 2, 1]);
    });

    it('funciona com Ref', () => {
        expect(sortedUniqBy(ref([1.1, 1.9, 2.5]), Math.floor)).toEqual([1.1, 2.5]);
    });
});
