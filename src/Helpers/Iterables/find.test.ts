import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { find } from './find';

describe('find', () => {
    it('retorna o primeiro elemento que casa com o predicado', () => {
        expect(find([1, 2, 3, 4], (x: number) => x > 2)).toBe(3);
    });

    it('retorna undefined quando nenhum elemento casa', () => {
        expect(find([1, 2, 3, 4], (x: number) => x > 10)).toBeUndefined();
    });

    it('aceita fromIndex', () => {
        expect(find([1, 2, 3], (x: number) => x > 1, 2)).toBe(3);
    });

    it('busca em objetos pelas chaves próprias', () => {
        expect(find({ a: 1, b: 2 }, (x: number) => x > 1)).toBe(2);
    });

    it('peculiaridade: objeto como predicado vira matches via iteratee', () => {
        expect(find([{ a: 1 }, { a: 2 }], { a: 2 })).toEqual({ a: 2 });
    });

    it('peculiaridade: array [path, valor] vira matchesProperty via iteratee', () => {
        expect(find([{ a: 1 }, { a: 2 }], ['a', 2])).toEqual({ a: 2 });
    });

    it('retorna undefined para coleção null ou undefined', () => {
        expect(find(null, () => true)).toBeUndefined();
        expect(find(undefined, () => true)).toBeUndefined();
    });

    it('funciona com Ref', () => {
        expect(find(ref([1, 2, 3]), (x: number) => x === 2)).toBe(2);
    });
});
