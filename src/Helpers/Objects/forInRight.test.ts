import { describe, it, expect } from 'vitest';
import { forInRight } from './forInRight';

describe('forInRight', () => {
    it('itera sobre propriedades na ordem inversa', () => {
        const out: unknown[] = [];
        forInRight({ a: 1, b: 2 }, (v, k) => out.push([v, k]));
        expect(out).toEqual([[2, 'b'], [1, 'a']]);
    });

    it('retorna o próprio objeto', () => {
        const obj = { a: 1 };
        expect(forInRight(obj, () => {})).toBe(obj);
    });

    it('retorna intocado para objeto null ou undefined', () => {
        expect(forInRight(null, () => {})).toBeNull();
    });
});
