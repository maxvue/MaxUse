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
});
