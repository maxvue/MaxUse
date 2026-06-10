import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { diff } from './diff';

describe('diff', () => {
    it('retorna objeto vazio quando ambos são iguais', () => {
        const obj = { a: 1, b: 'hello' };
        expect(diff(obj, obj)).toEqual({});
    });

    it('retorna propriedades alteradas', () => {
        const old = { a: 1, b: 2, c: 3 };
        const newObj = { a: 1, b: 99, c: 3 };
        expect(diff(old, newObj)).toEqual({ b: 99 });
    });

    it('retorna propriedades novas', () => {
        const old = { a: 1 };
        const newObj = { a: 1, b: 2 };
        expect(diff(old, newObj)).toEqual({ b: 2 });
    });

    it('inclui chaves de alwaysKeep mesmo sem mudança', () => {
        const old = { id: 1, name: 'João' };
        const newObj = { id: 1, name: 'João' };
        expect(diff(old, newObj, ['id'])).toEqual({ id: 1 });
    });

    it('ignora chaves de alwaysKeep que não existem no novo objeto', () => {
        const old = { a: 1 };
        const newObj = { a: 1 };
        expect(diff(old, newObj, ['missing_key'])).toEqual({});
    });

    it('lida com objetos nulos', () => {
        const newObj = { a: 1 };
        expect(diff(null, newObj)).toEqual({ a: 1 });
    });

    it('retorna vazio quando newObj é nulo', () => {
        const old = { a: 1 };
        expect(diff(old, null)).toEqual({});
    });

    it('compara objetos profundos corretamente', () => {
        const old = { config: { theme: 'dark' } };
        const newObj = { config: { theme: 'light' } };
        expect(diff(old, newObj)).toEqual({ config: { theme: 'light' } });
    });

    // Reatividade
    it('funciona com Ref', () => {
        const old = ref({ a: 1 });
        const newObj = ref({ a: 2 });
        expect(diff(old, newObj)).toEqual({ a: 2 });
    });
});
