import { describe, it, expect } from 'vitest';
import { sortByMulti } from './sortByMulti';

describe('sortByMulti (via re-export)', () => {
    it('é uma função', () => {
        expect(typeof sortByMulti).toBe('function');
    });

    it('ordena array por chave', () => {
        const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
        const result = sortByMulti(items, 'v');
        expect(result[0].v).toBe(1);
        expect(result[2].v).toBe(3);
    });
});
