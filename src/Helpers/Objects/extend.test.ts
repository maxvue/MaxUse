import { describe, it, expect } from 'vitest';
import { extend } from './extend';
import { assignIn } from './assignIn';

describe('extend', () => {
    it('é um alias de assignIn', () => {
        expect(extend).toBe(assignIn);
    });

    it('atribui propriedades próprias e herdadas', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        expect(extend({}, new (Foo as unknown as new () => { a: number; b?: number })())).toEqual({ a: 1, b: 2 });
    });
});
