import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { reject } from './reject';

describe('reject', () => {
    it('retorna os elementos que não casam com o predicado', () => {
        expect(reject([1, 2, 3, 4], (x: number) => x % 2 === 0)).toEqual([1, 3]);
    });

    it('funciona com objeto, sempre retornando array', () => {
        expect(reject({ a: 1, b: 2 }, (x: number) => x > 1)).toEqual([1]);
    });

    it('peculiaridade: objeto como predicado vira matches via iteratee', () => {
        expect(reject([{ a: 1 }, { a: 2 }], { a: 2 })).toEqual([{ a: 1 }]);
    });

    it('retorna vazio para coleção null ou undefined', () => {
        expect(reject(null, () => true)).toEqual([]);
        expect(reject(undefined, () => true)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(reject(ref([1, 2, 3]), (x: number) => x > 1)).toEqual([1]);
    });
});
