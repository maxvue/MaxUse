import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { valuesIn } from './valuesIn';

describe('valuesIn', () => {
    it('inclui valores herdados', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(valuesIn(new (Foo as any)())).toEqual([1, 2]);
    });

    it('objeto simples retorna valores próprios', () => {
        expect(valuesIn({ a: 1, b: 2 })).toEqual([1, 2]);
    });

    it('retorna vazio para null', () => {
        expect(valuesIn(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(valuesIn(undefined)).toEqual([]);
    });

    it('retorna vazio para objeto vazio', () => {
        expect(valuesIn({})).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(valuesIn(ref({ x: 1, y: 2 }))).toEqual([1, 2]);
    });
});
