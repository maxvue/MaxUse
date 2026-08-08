import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { conforms } from './conforms';

describe('conforms', () => {
    it('retorna true quando todos os predicados casam', () => {
        const check = conforms({ a: (n: unknown) => (n as number) > 1, b: (n: unknown) => (n as number) < 10 });
        expect(check({ a: 2, b: 5 })).toBe(true);
    });

    it('retorna false quando algum predicado falha', () => {
        const check = conforms({ a: (n: unknown) => (n as number) > 1, b: (n: unknown) => (n as number) < 10 });
        expect(check({ a: 0, b: 5 })).toBe(false);
    });

    it('ignora chaves extras no objeto verificado', () => {
        const check = conforms({ a: (n: unknown) => (n as number) > 1 });
        expect(check({ a: 2, c: 100 })).toBe(true);
    });

    it('source sem chaves sempre conforma', () => {
        expect(conforms({})({})).toBe(true);
    });

    it('predicado recebe undefined quando a chave não existe no objeto', () => {
        expect(conforms({ a: (n: unknown) => (n as number) > 1 })({})).toBe(false);
    });

    it('preserva os predicados por referência (não perde a capacidade de invocar)', () => {
        let calls = 0;
        const check = conforms({ a: () => { calls++; return true; } });
        check({ a: 1 });
        expect(calls).toBe(1);
    });

    it('funciona com Ref', () => {
        expect(conforms(ref({ a: (n: unknown) => (n as number) > 0 }))({ a: 1 })).toBe(true);
    });
});
