import { describe, it, expect } from 'vitest';
import { assignIn } from './assignIn';

describe('assignIn', () => {
    it('atribui propriedades de fontes em ordem, sobrescrevendo as anteriores', () => {
        expect(assignIn({ a: 1 }, { b: 2 }, { a: 3 })).toEqual({ a: 3, b: 2 });
    });

    it('peculiaridade: copia também propriedades herdadas via protótipo', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const result = assignIn({}, new (Foo as unknown as new () => { a: number; b?: number })());
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('trata object null/undefined como um novo objeto vazio', () => {
        expect(assignIn(null, { a: 1 })).toEqual({ a: 1 });
    });
});
