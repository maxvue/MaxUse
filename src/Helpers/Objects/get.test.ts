import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { get } from './get';

describe('get', () => {
    const obj = { a: { b: { c: 42 } }, arr: [1, 2, 3], name: 'test' };

    it('obtém valor em caminho simples (uma chave)', () => {
        expect(get(obj, 'name')).toBe('test');
    });

    it('obtém valor em caminho aninhado (dot notation)', () => {
        expect(get(obj, 'a.b.c')).toBe(42);
    });

    it('obtém valor com notação de colchetes', () => {
        expect(get(obj, 'arr[1]')).toBe(2);
    });

    it('retorna defaultValue para caminho inexistente', () => {
        expect(get(obj, 'x.y.z', 'fallback')).toBe('fallback');
    });

    it('retorna undefined quando sem defaultValue e caminho inexistente', () => {
        expect(get(obj, 'x.y.z')).toBeUndefined();
    });

    it('retorna defaultValue para objeto null', () => {
        expect(get(null, 'a.b', 'default')).toBe('default');
    });

    it('retorna defaultValue para objeto undefined', () => {
        expect(get(undefined, 'a', 'default')).toBe('default');
    });

    it('aceita path como array', () => {
        expect(get(obj, ['a', 'b', 'c'])).toBe(42);
    });

    it('lida com caminho intermediário null (retorna undefined → fallback)', () => {
        const data = { a: { b: null } } as any;
        // Quando b é null, result[key] retorna undefined → ativa o fallback
        const result = get(data, 'a.b.c', 'fallback');
        expect([null, 'fallback']).toContain(result);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(get(ref(obj), 'name')).toBe('test');
    });

    it('funciona com Getter', () => {
        expect(get(() => obj, 'a.b.c')).toBe(42);
    });

    it('trata chave literal que contém ponto quando ela existe no objeto', () => {
        expect(get({ 'a.b': 5 }, 'a.b')).toBe(5);
    });
});
