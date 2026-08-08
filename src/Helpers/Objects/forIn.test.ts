import { describe, it, expect } from 'vitest';
import { forIn } from './forIn';

describe('forIn', () => {
    it('itera sobre propriedades próprias e herdadas', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const out: unknown[] = [];
        forIn(new (Foo as unknown as new () => { a: number })(), (v, k) => out.push([v, k]));
        expect(out).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('para a iteração antecipadamente quando o callback retorna false', () => {
        const out: unknown[] = [];
        forIn({ a: 1, b: 2, c: 3 }, (v, k) => {
            out.push([v, k]);
            if (k === 'b') return false;
        });
        expect(out).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('retorna o próprio objeto', () => {
        const obj = { a: 1 };
        expect(forIn(obj, () => {})).toBe(obj);
    });

    it('retorna intocado para objeto null ou undefined', () => {
        expect(forIn(null, () => {})).toBeNull();
    });
});
