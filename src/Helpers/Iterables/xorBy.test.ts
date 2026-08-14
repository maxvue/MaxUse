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

    it('trata chaves NaN com SameValueZero', () => {
        expect(xorBy([{ x: NaN }], [{ x: NaN }], 'x')).toEqual([]);
    });

    it('considera chaves -0 e +0 iguais', () => {
        expect(xorBy([{ x: -0 }], [{ x: 0 }], 'x')).toEqual([]);
    });

    it('o atalho de um único array válido deduplica NaN e -0/+0 por SameValueZero', () => {
        const resultado = xorBy([NaN, NaN, -0, 0, 1]);
        expect(resultado.length).toBe(3);
        expect(Number.isNaN(resultado[0])).toBe(true);
        expect(Object.is(resultado[1], -0)).toBe(true);
    });

    it('invoca o iteratee uma vez por elemento', () => {
        let chamadas = 0;
        xorBy([1, 2, 3], [3, 4], (value: number) => {
            chamadas++;
            return value;
        });
        expect(chamadas).toBe(5);
    });
});
