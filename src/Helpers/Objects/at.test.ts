import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { at } from './at';

describe('at', () => {
    it('aceita múltiplos paths como array', () => {
        const obj = { a: [{ b: { c: 3 } }, 4] };
        expect(at(obj, ['a[0].b.c', 'a[1]'])).toEqual([3, 4]);
    });

    it('aceita múltiplos paths como argumentos separados', () => {
        const obj = { a: [{ b: { c: 3 } }, 4] };
        expect(at(obj, 'a[0].b.c', 'a[1]')).toEqual([3, 4]);
    });

    it('retorna undefined para caminho inexistente', () => {
        expect(at({ a: 1 }, 'nope')).toEqual([undefined]);
    });

    it('retorna array de undefined para objeto null', () => {
        expect(at(null, 'a')).toEqual([undefined]);
    });

    it('retorna vazio quando nenhum path é passado', () => {
        expect(at({ a: 1 })).toEqual([]);
    });

    it('aceita paths numéricos (índice de array)', () => {
        expect(at([1, 2, 3], [0, 2])).toEqual([1, 3]);
        expect(at([10, 20], 0, 1)).toEqual([10, 20]);
        expect(at({ a: 1 }, 0)).toEqual([undefined]);
    });

    it('funciona com Ref', () => {
        expect(at(ref({ a: 1, b: 2 }), 'a', 'b')).toEqual([1, 2]);
    });
});
