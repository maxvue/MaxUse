import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { property } from './property';

describe('property', () => {
    it('cria função que retorna valor no caminho simples', () => {
        expect(property('a')({ a: 1 })).toBe(1);
    });

    it('resolve caminho profundo com ponto', () => {
        expect(property('a.b')({ a: { b: 2 } })).toBe(2);
    });

    it('resolve caminho com array de segmentos', () => {
        expect(property(['a', 'b'])({ a: { b: 2 } })).toBe(2);
    });

    it('resolve caminho com colchetes e índice de array', () => {
        expect(property('a[0].b')({ a: [{ b: 5 }] })).toBe(5);
    });

    it('resolve chave numérica direto em array', () => {
        expect(property(1)([1, 2, 3])).toBe(2);
    });

    it('retorna undefined para caminho ausente', () => {
        expect(property('a.b.c')({ a: {} })).toBeUndefined();
    });

    it('retorna undefined para objeto null ou undefined', () => {
        expect(property('a')(null)).toBeUndefined();
        expect(property('a')(undefined)).toBeUndefined();
    });

    it('retorna undefined para caminho vazio', () => {
        expect(property('')({ a: 1 })).toBeUndefined();
    });

    it('resolve o caminho uma única vez, no momento da criação', () => {
        const path = ref('a');
        const getA = property(path);
        path.value = 'b';
        expect(getA({ a: 1, b: 2 })).toBe(1);
    });

    it('funciona com Ref', () => {
        expect(property(ref('a.b'))({ a: { b: 3 } })).toBe(3);
    });
});
