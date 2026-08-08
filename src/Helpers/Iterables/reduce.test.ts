import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { reduce } from './reduce';

describe('reduce', () => {
    it('reduz com valor inicial explícito', () => {
        expect(reduce([1, 2, 3], (acc: number, v: number) => acc + v, 0)).toBe(6);
    });

    it('sem valor inicial, usa o primeiro elemento como acumulador', () => {
        expect(reduce([1, 2, 3], (acc: number, v: number) => acc + v)).toBe(6);
    });

    it('funciona com objeto, dobrando sobre os valores', () => {
        expect(reduce({ a: 1, b: 2 }, (acc: number, v: number) => acc + v)).toBe(3);
    });

    it('array vazio com valor inicial retorna o valor inicial', () => {
        expect(reduce([], (acc: number, v: number) => acc + v, 5)).toBe(5);
    });

    it('array vazio sem valor inicial retorna undefined', () => {
        expect(reduce([], (acc: number, v: number) => acc + v)).toBeUndefined();
    });

    it('coleção null com valor inicial retorna o valor inicial', () => {
        expect(reduce(null, (acc: number, v: number) => acc + v, 5)).toBe(5);
    });

    it('repassa chave e coleção ao iteratee', () => {
        const seen: Array<[number, string]> = [];
        reduce({ a: 1, b: 2 }, (acc: number, v: number, k: number | string) => { seen.push([v, k as string]); return acc; }, 0);
        expect(seen).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('funciona com Ref', () => {
        expect(reduce(ref([1, 2, 3]), (acc: number, v: number) => acc + v, 10)).toBe(16);
    });
});
