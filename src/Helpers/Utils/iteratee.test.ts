import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { iteratee } from './iteratee';

describe('iteratee', () => {
    it('peculiaridade: string vira property', () => {
        expect(iteratee('a')({ a: 1 })).toBe(1);
    });

    it('peculiaridade: array [path, srcValue] vira matchesProperty', () => {
        expect(iteratee(['a', 1])({ a: 1 })).toBe(true);
        expect(iteratee(['a', 1])({ a: 2 })).toBe(false);
    });

    it('peculiaridade: objeto plano vira matches', () => {
        expect(iteratee({ a: 1 })({ a: 1, b: 2 })).toBe(true);
        expect(iteratee({ a: 1 })({ a: 2 })).toBe(false);
    });

    it('peculiaridade: função é retornada intocada', () => {
        const fn = (x: number) => x * 2;
        const it2 = iteratee(fn);
        expect(it2).toBe(fn);
        expect(it2(3)).toBe(6);
    });

    it('número vira property por índice', () => {
        expect(iteratee(1)([10, 20, 30])).toBe(20);
    });

    it('sem argumento, null ou undefined vira identidade', () => {
        expect(iteratee()(5)).toBe(5);
        expect(iteratee(null)(5)).toBe(5);
        expect(iteratee(undefined)(5)).toBe(5);
        const obj = { x: 1 };
        expect(iteratee()(obj)).toBe(obj);
    });

    it('funciona com Ref contendo função', () => {
        const fn = (x: number) => x + 1;
        expect(iteratee(ref(fn))(1)).toBe(2);
    });

    it('funciona com Ref contendo string', () => {
        expect(iteratee(ref('a'))({ a: 9 })).toBe(9);
    });
});
