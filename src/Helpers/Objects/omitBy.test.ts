import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { omitBy } from './omitBy';

describe('omitBy', () => {
    it('remove propriedades cujo valor casa com o predicado', () => {
        expect(omitBy({ a: 1, b: 'x', c: 3 }, (v: unknown) => typeof v === 'number')).toEqual({ b: 'x' });
    });

    it('mantém propriedades que não casam', () => {
        expect(omitBy({ a: 1, b: 2 }, (v: number) => v > 1)).toEqual({ a: 1 });
    });

    it('retorna objeto vazio para objeto null ou undefined', () => {
        expect(omitBy(null, () => true)).toEqual({});
    });

    it('funciona com Ref', () => {
        expect(omitBy(ref({ a: 1, b: 2 }), (v: number) => v === 1)).toEqual({ b: 2 });
    });

    it('peculiaridade: considera propriedades herdadas via protótipo, não só próprias', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const instance = new (Foo as unknown as new () => { a: number; b?: number })();
        expect(omitBy(instance, (v: unknown) => v === 1)).toEqual({ b: 2 });
    });
});
