import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { keys } from './keys';

describe('keys', () => {
    it('retorna chaves próprias enumeráveis de um objeto', () => {
        expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
    });

    it('string vira índices', () => {
        expect(keys('abc')).toEqual(['0', '1', '2']);
    });

    it('array vira índices', () => {
        expect(keys([1, 2, 3])).toEqual(['0', '1', '2']);
    });

    it('só retorna chaves próprias, não herdadas', () => {
        function Foo(this: any) {
            this.a = 1;
        }
        Foo.prototype.b = 2;
        expect(keys(new (Foo as any)())).toEqual(['a']);
    });

    it('retorna vazio para null', () => {
        expect(keys(null)).toEqual([]);
    });

    it('retorna vazio para undefined', () => {
        expect(keys(undefined)).toEqual([]);
    });

    it('retorna vazio para primitivos (número, booleano)', () => {
        expect(keys(1)).toEqual([]);
        expect(keys(true)).toEqual([]);
    });

    it('retorna vazio para objeto vazio', () => {
        expect(keys({})).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(keys(ref({ x: 1, y: 2 }))).toEqual(['x', 'y']);
    });
});
