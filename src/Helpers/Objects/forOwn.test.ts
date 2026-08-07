import { describe, it, expect } from 'vitest';
import { forOwn } from './forOwn';

describe('forOwn', () => {
    it('peculiaridade: itera apenas propriedades próprias, não herdadas', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const out: unknown[] = [];
        forOwn(new (Foo as unknown as new () => { a: number })(), (v, k) => out.push([v, k]));
        expect(out).toEqual([[1, 'a']]);
    });

    it('para a iteração antecipadamente quando o callback retorna false', () => {
        const out: unknown[] = [];
        forOwn({ a: 1, b: 2, c: 3 }, (v, k) => {
            out.push([v, k]);
            if (k === 'a') return false;
        });
        expect(out).toEqual([[1, 'a']]);
    });

    it('retorna o próprio objeto', () => {
        const obj = { a: 1 };
        expect(forOwn(obj, () => {})).toBe(obj);
    });
});
