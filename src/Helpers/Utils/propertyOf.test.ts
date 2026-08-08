import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { propertyOf } from './propertyOf';

describe('propertyOf', () => {
    it('cria função que consulta o caminho no objeto fixado', () => {
        const get = propertyOf({ a: 1, b: { c: 2 } });
        expect(get('a')).toBe(1);
        expect(get('b.c')).toBe(2);
    });

    it('retorna undefined para caminho ausente', () => {
        expect(propertyOf({ a: 1 })('b')).toBeUndefined();
    });

    it('retorna undefined quando o objeto é null ou undefined', () => {
        expect(propertyOf(null)('a')).toBeUndefined();
        expect(propertyOf(undefined)('a')).toBeUndefined();
    });

    it('aceita caminho como array de segmentos', () => {
        expect(propertyOf({ a: { b: 3 } })(['a', 'b'])).toBe(3);
    });

    it('fixa o objeto no momento da criação', () => {
        const source = { a: 1 };
        const get = propertyOf(source);
        source.a = 2;
        expect(get('a')).toBe(2);
    });

    it('funciona com Ref', () => {
        expect(propertyOf(ref({ a: 5 }))('a')).toBe(5);
    });
});
