import { describe, it, expect } from 'vitest';
import { splitRestIteratee } from './_restIteratee';

describe('splitRestIteratee', () => {
    it('retorna [[], undefined] para argumentos vazios', () => {
        expect(splitRestIteratee([])).toEqual([[], undefined]);
    });

    it('retorna todos os arrays e undefined se o último argumento for array', () => {
        const arr1 = [1, 2];
        const arr2 = [3, 4];
        const result = splitRestIteratee([arr1, arr2]);
        expect(result).toEqual([[arr1, arr2], undefined]);
    });

    it('extrai o último argumento como iteratee se ele não for array', () => {
        const arr1 = [{ x: 1 }];
        const fn = (o: any) => o.x;
        const result = splitRestIteratee([arr1, fn]);
        expect(result).toEqual([[arr1], fn]);
    });
});
