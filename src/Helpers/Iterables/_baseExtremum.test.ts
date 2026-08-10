import { describe, it, expect } from 'vitest';
import { baseExtremum } from './_baseExtremum';

describe('baseExtremum', () => {
    it('retorna o elemento máximo de acordo com o comparador', () => {
        const result = baseExtremum([1, 5, 3, 2], (x) => x, (a, b) => (a as number) > (b as number));
        expect(result).toBe(5);
    });

    it('retorna o elemento mínimo de acordo com o comparador', () => {
        const result = baseExtremum([4, 2, 8, 1], (x) => x, (a, b) => (a as number) < (b as number));
        expect(result).toBe(1);
    });

    it('ignora null, undefined e Symbol ao calcular o vencedor', () => {
        const sym = Symbol('test');
        const array = [null, undefined, sym, { val: 10 }, { val: 20 }];
        const result = baseExtremum(array, (x: any) => x?.val, (a, b) => (a as number) > (b as number));
        expect(result).toEqual({ val: 20 });
    });

    it('retorna undefined para array vazio ou sem elementos válidos', () => {
        expect(baseExtremum([], (x) => x, (a, b) => (a as number) > (b as number))).toBeUndefined();
        expect(baseExtremum([null, undefined], (x) => x, (a, b) => (a as number) > (b as number))).toBeUndefined();
    });
});
