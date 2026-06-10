import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
    it('retorna array com mesmos elementos', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = shuffle(arr);
        expect(result.length).toBe(arr.length);
        expect(result.sort()).toEqual(arr.sort());
    });

    it('não modifica o array original', () => {
        const arr = [1, 2, 3];
        const original = [...arr];
        shuffle(arr);
        expect(arr).toEqual(original);
    });
});
