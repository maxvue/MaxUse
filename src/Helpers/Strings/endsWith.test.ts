import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { endsWith } from './endsWith';

describe('endsWith', () => {
    it('verifica se a string termina com o alvo', () => {
        expect(endsWith('abc', 'c')).toBe(true);
        expect(endsWith('abc', 'a')).toBe(false);
    });

    it('aceita posição final customizada (peculiaridade)', () => {
        expect(endsWith('abc', 'b', 2)).toBe(true);
    });

    it('retorna false quando target é maior que a posição final (guarda start >= 0)', () => {
        expect(endsWith('abc', 'abc', 1)).toBe(false);
        expect(endsWith('abc', 'abcd', 2)).toBe(false);
    });

    it('retorna false para null e undefined', () => {
        expect(endsWith(null, 'a')).toBe(false);
    });

    it('target null/undefined vira o literal "null"/"undefined", não string vazia (peculiaridade)', () => {
        expect(endsWith('abc', null)).toBe(false);
        expect(endsWith('abc-null', null)).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(endsWith(ref('abc'), ref('c'))).toBe(true);
    });
});
