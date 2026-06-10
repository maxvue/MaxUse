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
});
