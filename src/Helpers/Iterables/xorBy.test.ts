import { describe, it, expect } from 'vitest';
import { xorBy } from './xorBy';

describe('xorBy', () => {
    it('retorna elementos presentes em exatamente um array, por critério', () => {
        expect(xorBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([1.2, 3.4]);
    });

    it('sem iteratee (último argumento é array), usa identidade', () => {
        expect(xorBy([1, 2], [2, 3])).toEqual([1, 3]);
    });

    it('elemento presente em ambos os arrays (mesmo critério) não aparece no resultado', () => {
        expect(xorBy([2.1], [2.3], Math.floor)).toEqual([]);
    });

    it('peculiaridade: com um único array válido, o iteratee é ignorado — só deduplica por SameValueZero', () => {
        expect(xorBy([1, 2], () => 0)).toEqual([1, 2]);
        expect(xorBy([{ x: 1 }, { x: 1 }], 'x')).toEqual([{ x: 1 }, { x: 1 }]);
        expect(xorBy([1, 1, 2])).toEqual([1, 2]);
    });

    it('retorna vazio sem nenhum array válido', () => {
        expect(xorBy()).toEqual([]);
    });
});
