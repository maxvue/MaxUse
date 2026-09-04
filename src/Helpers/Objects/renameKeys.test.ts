import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { renameKeys } from './renameKeys';

describe('renameKeys', () => {
    it('renomeia chaves conforme mapa', () => {
        const obj = { name: 'João', age: 30 };
        const map = { name: 'nome', age: 'idade' };
        expect(renameKeys(obj, map)).toEqual({ nome: 'João', idade: 30 });
    });

    it('mantém chaves não mapeadas intactas', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const map = { a: 'x' };
        expect(renameKeys(obj, map)).toEqual({ x: 1, b: 2, c: 3 });
    });

    it('lida com mapa vazio (retorna cópia)', () => {
        const obj = { a: 1 };
        expect(renameKeys(obj, {})).toEqual({ a: 1 });
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ old: 'value' });
        const map = ref({ old: 'new' });
        expect(renameKeys(obj, map)).toEqual({ new: 'value' });
    });

    it('não troca o protótipo do objeto retornado quando o mapa aponta para __proto__', () => {
        const result = renameKeys({ nome: { isAdmin: true } }, { nome: '__proto__' });

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(result.isAdmin).toBeUndefined();
        expect(({} as Record<string, unknown>).isAdmin).toBeUndefined();
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
    });

    it('não troca o protótipo do objeto retornado quando a origem traz __proto__ próprio', () => {
        const payload = JSON.parse('{"__proto__":{"isAdmin":true}}');
        const result = renameKeys(payload, {});

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(result.isAdmin).toBeUndefined();
    });

    it('retorna objeto vazio quando object é null ou undefined', () => {
        expect(renameKeys(null, { a: 'b' })).toEqual({});
        expect(renameKeys(undefined, { a: 'b' })).toEqual({});
    });

    it('retorna objeto vazio quando object é Ref ou Getter com null ou undefined', () => {
        const nullRef = ref<Record<string, any> | null>(null);
        const undefinedRef = ref<Record<string, any> | undefined>(undefined);
        expect(renameKeys(nullRef, { a: 'b' })).toEqual({});
        expect(renameKeys(undefinedRef, { a: 'b' })).toEqual({});
        expect(renameKeys(() => null, { a: 'b' })).toEqual({});
        expect(renameKeys(() => undefined, { a: 'b' })).toEqual({});
    });

    it('mantém chaves originais quando map é null ou undefined', () => {
        const obj = { a: 1, b: 2 };
        expect(renameKeys(obj, null)).toEqual({ a: 1, b: 2 });
        expect(renameKeys(obj, undefined)).toEqual({ a: 1, b: 2 });
        expect(renameKeys(obj)).toEqual({ a: 1, b: 2 });
    });

    it('mantém chaves originais quando map é Ref ou Getter com null ou undefined', () => {
        const obj = { a: 1, b: 2 };
        const nullMapRef = ref<Record<string, string> | null>(null);
        expect(renameKeys(obj, nullMapRef)).toEqual({ a: 1, b: 2 });
        expect(renameKeys(obj, () => null)).toEqual({ a: 1, b: 2 });
    });

    it('lida com ambos os parâmetros null ou undefined', () => {
        expect(renameKeys(null, null)).toEqual({});
        expect(renameKeys(undefined, undefined)).toEqual({});
    });

    it('retorna objeto vazio quando object é um valor primitivo', () => {
        expect(renameKeys(123 as any, {})).toEqual({});
        expect(renameKeys('string' as any, {})).toEqual({});
        expect(renameKeys(true as any, {})).toEqual({});
    });
});

