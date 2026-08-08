import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toPairsIn } from './toPairsIn';

describe('toPairsIn', () => {
    it('inclui propriedades herdadas', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(toPairsIn(new (Foo as any)())).toEqual([['a', 1], ['b', 2]]);
    });

    it('objeto simples retorna pares próprios', () => {
        expect(toPairsIn({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
    });

    it('retorna vazio para null', () => {
        expect(toPairsIn(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(toPairsIn(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(toPairsIn(ref({ x: 1 }))).toEqual([['x', 1]]);
    });
});
