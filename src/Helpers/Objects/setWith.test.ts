import { describe, it, expect } from 'vitest';
import { setWith } from './setWith';

describe('setWith', () => {
    it('peculiaridade: customizer Object força objetos planos mesmo em segmentos de índice', () => {
        const obj: Record<string, unknown> = {};
        setWith(obj, 'a[0].b', 1, Object);
        expect(obj).toEqual({ a: { 0: { b: 1 } } });
        expect(Array.isArray((obj.a as Record<string, unknown>))).toBe(false);
    });

    it('sem customizer, comporta-se como set (cria array para índice)', () => {
        const obj: Record<string, unknown> = {};
        setWith(obj, 'a.b', 1);
        expect(obj).toEqual({ a: { b: 1 } });
    });

    it('retorna intocado para objeto null ou undefined', () => {
        expect(setWith(null, 'a', 1)).toBeNull();
    });

    it('customizer retornando undefined cai no comportamento padrão', () => {
        const obj: Record<string, unknown> = {};
        setWith(obj, 'a[0]', 1, () => undefined);
        expect(Array.isArray(obj.a)).toBe(true);
    });
});
