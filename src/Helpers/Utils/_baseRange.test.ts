import { describe, it, expect } from 'vitest';
import { baseRange } from './_baseRange';

describe('baseRange', () => {
    it('gera sequencia de numeros do inicio ao fim', () => {
        expect(baseRange(0, 5, 1, false)).toEqual([0, 1, 2, 3, 4]);
        expect(baseRange(0, 10, 2, false)).toEqual([0, 2, 4, 6, 8]);
    });

    it('gera sequencia na ordem inversa quando fromRight e true', () => {
        expect(baseRange(0, 5, 1, true)).toEqual([4, 3, 2, 1, 0]);
    });
});
