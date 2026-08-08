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
});
