import { describe, it, expect } from 'vitest';
import { intersectionBy } from './intersectionBy';

describe('intersectionBy', () => {
    it('retorna elementos cujo critério aparece em todos os arrays', () => {
        expect(intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([2.1]);
    });

    it('peculiaridade: aceita string como property via iteratee', () => {
        expect(intersectionBy([{ x: 1 }], [{ x: 1 }, { x: 2 }], 'x')).toEqual([{ x: 1 }]);
    });

    it('sem iteratee (último argumento é array), usa identidade', () => {
        expect(intersectionBy([1, 2], [2, 3])).toEqual([2]);
    });

    it('retorna vazio sem argumentos', () => {
        expect(intersectionBy()).toEqual([]);
    });

    it('resultado vem do primeiro array', () => {
        const result = intersectionBy([{ x: 1, tag: 'first' }], [{ x: 1, tag: 'second' }], 'x');
        expect(result).toEqual([{ x: 1, tag: 'first' }]);
    });
});
