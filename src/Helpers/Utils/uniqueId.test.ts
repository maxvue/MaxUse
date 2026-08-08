import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { uniqueId } from './uniqueId';

describe('uniqueId', () => {
    it('gera IDs incrementais em cada chamada (peculiaridade: contador global compartilhado)', () => {
        const first = uniqueId();
        const second = uniqueId();
        expect(Number(second)).toBe(Number(first) + 1);
    });

    it('aceita prefixo string', () => {
        const id = uniqueId('item_');
        expect(id.startsWith('item_')).toBe(true);
    });

    it('aceita prefixo numérico, convertendo para string', () => {
        const id = uniqueId(123);
        expect(id.startsWith('123')).toBe(true);
    });

    it('funciona sem argumento e com null/undefined, sem prefixo literal "null"/"undefined" (peculiaridade)', () => {
        const withNull = uniqueId(null);
        const withUndefined = uniqueId(undefined);
        expect(withNull).toMatch(/^\d+$/);
        expect(withUndefined).toMatch(/^\d+$/);
        expect(withNull.startsWith('null')).toBe(false);
        expect(withUndefined.startsWith('undefined')).toBe(false);
    });

    it('funciona com Ref', () => {
        const id = uniqueId(ref('x_'));
        expect(id.startsWith('x_')).toBe(true);
    });
});
