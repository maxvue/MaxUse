import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { unset } from './unset';

describe('unset', () => {
    it('remove propriedade de nível raiz', () => {
        const obj = { a: 1, b: 2 };
        const result = unset(obj, 'a');
        expect(result).toBe(true);
        expect(obj).toEqual({ b: 2 });
    });

    it('remove propriedade em caminho aninhado', () => {
        const obj = { a: { b: { c: 42, d: 10 } } };
        unset(obj, 'a.b.c');
        expect(obj.a.b).toEqual({ d: 10 });
    });

    it('retorna true para caminho inexistente (nada a remover)', () => {
        const obj = { a: 1 };
        expect(unset(obj, 'x.y.z')).toBe(true);
    });

    it('retorna true se uma chave intermediária existir mas não for objeto', () => {
        const obj = { a: { b: 42 } };
        expect(unset(obj, 'a.b.c')).toBe(true);
        const obj2 = { a: { b: null } };
        expect(unset(obj2, 'a.b.c')).toBe(true);
    });

    it('retorna false para null como objeto', () => {
        expect(unset(null, 'a')).toBe(false);
    });

    it('retorna false para primitivo', () => {
        expect(unset(42, 'a')).toBe(false);
    });

    it('aceita path como array', () => {
        const obj = { a: { b: 1, c: 2 } };
        unset(obj, ['a', 'b']);
        expect(obj.a).toEqual({ c: 2 });
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ x: 1, y: 2 });
        unset(obj, 'x');
        expect(obj.value).toEqual({ y: 2 });
    });

    it('remove chave literal com ponto quando ela existe no objeto', () => {
        const obj: Record<string, unknown> = { 'a.b': 1, a: { b: 2 } };
        unset(obj, 'a.b');
        expect(obj).toEqual({ a: { b: 2 } });
    });

    it('não permite poluição nem remoção indesejada em __proto__', () => {
        const obj = {};
        expect(unset(obj, '__proto__.pollutedU')).toBe(true);
        expect(({} as Record<string, unknown>).pollutedU).toBeUndefined();
    });
});
