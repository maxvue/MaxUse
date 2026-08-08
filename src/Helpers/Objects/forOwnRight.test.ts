import { describe, it, expect } from 'vitest';
import { forOwnRight } from './forOwnRight';

describe('forOwnRight', () => {
    it('itera sobre propriedades próprias na ordem inversa', () => {
        const out: unknown[] = [];
        forOwnRight({ a: 1, b: 2 }, (v, k) => out.push([v, k]));
        expect(out).toEqual([[2, 'b'], [1, 'a']]);
    });

    it('retorna o próprio objeto', () => {
        const obj = { a: 1 };
        expect(forOwnRight(obj, () => {})).toBe(obj);
    });
});
