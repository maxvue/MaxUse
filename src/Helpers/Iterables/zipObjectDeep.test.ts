import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { zipObjectDeep } from './zipObjectDeep';

describe('zipObjectDeep', () => {
    it('monta objeto aninhado a partir de caminhos com ponto', () => {
        expect(zipObjectDeep(['a.b', 'a.c'], [1, 2])).toEqual({ a: { b: 1, c: 2 } });
    });

    it('peculiaridade: caminho com colchetes de índice cria array, não objeto', () => {
        const result = zipObjectDeep(['a[0].b', 'a[1].b'], [1, 2]);
        expect(result).toEqual({ a: [{ b: 1 }, { b: 2 }] });
        expect(Array.isArray((result.a as unknown[]))).toBe(true);
    });

    it('retorna objeto vazio para props null ou undefined', () => {
        expect(zipObjectDeep(null, [1, 2])).toEqual({});
    });

    it('retorna objeto vazio para values null ou undefined', () => {
        expect(zipObjectDeep(['a'], null)).toEqual({ a: undefined });
    });

    it('funciona com Ref', () => {
        expect(zipObjectDeep(ref(['a.b']), ref([1]))).toEqual({ a: { b: 1 } });
    });
});
