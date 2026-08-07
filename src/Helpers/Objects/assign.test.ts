import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { assign } from './assign';

describe('assign', () => {
    it('atribui propriedades de fontes em ordem, sobrescrevendo as anteriores', () => {
        expect(assign({ a: 1 }, { b: 2 }, { a: 3 })).toEqual({ a: 3, b: 2 });
    });

    it('ignora fontes null ou undefined', () => {
        expect(assign({}, null, undefined, { a: 1 })).toEqual({ a: 1 });
    });

    it('trata object null/undefined como um novo objeto vazio', () => {
        expect(assign(null, { a: 1 })).toEqual({ a: 1 });
    });

    it('peculiaridade: só copia propriedades próprias, não herdadas via protótipo', () => {
        function Foo(this: { a: number }) { this.a = 1; }
        (Foo as unknown as { prototype: { b: number } }).prototype.b = 2;
        const result = assign({}, new (Foo as unknown as new () => { a: number; b?: number })());
        expect(result).toEqual({ a: 1 });
    });

    it('muta e retorna o próprio objeto de destino', () => {
        const target = { a: 1 };
        const result = assign(target, { b: 2 });
        expect(result).toBe(target);
    });

    it('funciona com Ref', () => {
        expect(assign(ref({ a: 1 }), { b: 2 })).toEqual({ a: 1, b: 2 });
    });
});
