import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pick, omit } from './manipulations';

describe('pick', () => {
    it('retorna objeto com apenas as chaves selecionadas', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('ignora chaves inexistentes silenciosamente', () => {
        const obj = { a: 1 } as any;
        expect(pick(obj, ['a', 'z'])).toEqual({ a: 1 });
    });

    it('retorna objeto vazio quando nenhuma chave corresponde', () => {
        const obj = { a: 1 } as any;
        expect(pick(obj, ['x'] as any)).toEqual({});
    });

    it('retorna objeto vazio para input falsy', () => {
        expect(pick(null as any, ['a'] as any)).toEqual({});
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ a: 1, b: 2 });
        expect(pick(obj, ['a'])).toEqual({ a: 1 });
    });
});

describe('omit', () => {
    it('retorna objeto sem as chaves removidas', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('retorna cópia completa quando chaves não existem', () => {
        const obj = { a: 1 } as any;
        expect(omit(obj, ['z'] as any)).toEqual({ a: 1 });
    });

    it('retorna objeto vazio ao omitir todas as chaves', () => {
        const obj = { a: 1, b: 2 };
        expect(omit(obj, ['a', 'b'])).toEqual({});
    });

    it('retorna objeto vazio para input falsy', () => {
        expect(omit(null as any, ['a'] as any)).toEqual({});
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ a: 1, b: 2, c: 3 });
        expect(omit(obj, ['c'])).toEqual({ a: 1, b: 2 });
    });
});
