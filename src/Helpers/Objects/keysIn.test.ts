import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { keysIn } from './keysIn';

describe('keysIn', () => {
    it('inclui herdadas', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(keysIn(new (Foo as any)())).toEqual(['a', 'b']);
    });

    it('string vira índices', () => {
        expect(keysIn('ab')).toEqual(['0', '1']);
    });

    it('array vira índices e inclui props extras', () => {
        const arr = [1, 2, 3] as any;
        arr.foo = 'bar';
        expect(keysIn(arr)).toEqual(['0', '1', '2', 'foo']);
    });

    it('objeto simples retorna chaves próprias', () => {
        expect(keysIn({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });

    it('retorna vazio para null', () => {
        expect(keysIn(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(keysIn(undefined)).toEqual([]);
    });

    it('retorna vazio para primitivos', () => {
        expect(keysIn(1)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(keysIn(ref({ x: 1 }))).toEqual(['x']);
    });
});
