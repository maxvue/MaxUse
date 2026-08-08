import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { conformsTo } from './conformsTo';

describe('conformsTo', () => {
    it('retorna true quando o objeto conforma com todos os predicados', () => {
        expect(conformsTo({ a: 2 }, { a: (n: unknown) => (n as number) > 1 })).toBe(true);
    });

    it('retorna false quando algum predicado falha', () => {
        expect(conformsTo({ a: 0 }, { a: (n: unknown) => (n as number) > 1 })).toBe(false);
    });

    it('source null ou undefined sempre conforma', () => {
        expect(conformsTo({ a: 2 }, null)).toBe(true);
        expect(conformsTo({ a: 2 }, undefined)).toBe(true);
    });

    it('source sem chaves sempre conforma', () => {
        expect(conformsTo({}, { a: (n: unknown) => (n as number) > 1 })).toBe(false);
        expect(conformsTo({}, {})).toBe(true);
    });

    it('objeto null ou undefined falha se source tiver predicados', () => {
        expect(conformsTo(null, { a: (n: unknown) => (n as number) > 1 })).toBe(false);
        expect(conformsTo(undefined, { a: (n: unknown) => (n as number) > 1 })).toBe(false);
    });

    it('objeto null com source vazio ainda conforma', () => {
        expect(conformsTo(null, {})).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(conformsTo(ref({ a: 5 }), ref({ a: (n: unknown) => (n as number) > 0 }))).toBe(true);
    });
});
