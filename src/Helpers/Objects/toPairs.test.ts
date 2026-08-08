import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toPairs } from './toPairs';

describe('toPairs', () => {
    it('converte objeto em pares chave-valor', () => {
        expect(toPairs({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
    });

    it('só considera propriedades próprias', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(toPairs(new (Foo as any)())).toEqual([['a', 1]]);
    });

    it('retorna vazio para null', () => {
        expect(toPairs(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(toPairs(undefined)).toEqual([]);
    });

    it('retorna vazio para objeto vazio', () => {
        expect(toPairs({})).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(toPairs(ref({ x: 1 }))).toEqual([['x', 1]]);
    });
});
