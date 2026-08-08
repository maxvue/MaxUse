import { describe, it, expect } from 'vitest';
import { functions } from './functions';

describe('functions', () => {
    it('peculiaridade: retorna só nomes de propriedades próprias que são função', () => {
        function Foo(this: { a: number; b: () => number }) { this.a = 1; this.b = () => 2; }
        (Foo as unknown as { prototype: { c: () => void } }).prototype.c = () => {};
        expect(functions(new (Foo as unknown as new () => { a: number; b: () => number })())).toEqual(['b']);
    });

    it('retorna vazio para objeto sem métodos', () => {
        expect(functions({ a: 1 })).toEqual([]);
    });

    it('retorna vazio para objeto null ou undefined', () => {
        expect(functions(null)).toEqual([]);
    });
});
