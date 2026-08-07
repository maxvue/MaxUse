import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { transform } from './transform';

describe('transform', () => {
    it('acumula com accumulator explícito, array', () => {
        expect(transform([1, 2, 3], (acc: number[], v: number) => { acc.push(v * 2); }, [])).toEqual([2, 4, 6]);
    });

    it('acumula com accumulator explícito, objeto', () => {
        expect(transform({ a: 1, b: 2 }, (acc: Record<string, number>, v: number, k: number | string) => { acc[k] = v * 2; }, {})).toEqual({ a: 2, b: 4 });
    });

    it('sem accumulator, cria um novo baseado no tipo de object', () => {
        expect(transform({ a: 1, b: 2 }, (acc: Record<string, number>, v: number, k: number | string) => { acc[k] = v * 2; })).toEqual({ a: 2, b: 4 });
        expect(transform([1, 2], (acc: number[], v: number) => { acc.push(v * 2); })).toEqual([2, 4]);
    });

    it('peculiaridade: para a iteração antecipadamente quando o iteratee retorna false', () => {
        expect(transform([1, 2, 3], (acc: number[], v: number) => { acc.push(v); return v < 2; })).toEqual([1, 2]);
    });

    it('retorna o acumulador vazio para object null ou undefined', () => {
        expect(transform(null)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(transform(ref([1, 2]), (acc: number[], v: number) => { acc.push(v * 10); }, [])).toEqual([10, 20]);
    });
});
