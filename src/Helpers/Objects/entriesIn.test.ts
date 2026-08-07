import { describe, it, expect } from 'vitest';
import { entriesIn } from './entriesIn';
import { toPairsIn } from './toPairsIn';

describe('entriesIn', () => {
    it('é um alias de toPairsIn', () => {
        expect(entriesIn).toBe(toPairsIn);
    });

    it('converte objeto em array de pares, incluindo herdados', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        expect(entriesIn(new (Foo as unknown as new () => { a: number })())).toEqual([['a', 1], ['b', 2]]);
    });
});
