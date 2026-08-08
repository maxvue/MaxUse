import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toUpper } from './toUpper';

describe('toUpper', () => {
    it('converte string para maiúsculas', () => {
        expect(toUpper('abc')).toBe('ABC');
    });

    it('retorna string vazia para null e undefined (peculiaridade)', () => {
        expect(toUpper(null)).toBe('');
        expect(toUpper(undefined)).toBe('');
    });

    it('converte número para string antes de aplicar toUpperCase', () => {
        expect(toUpper(123)).toBe('123');
    });

    it('funciona com Ref', () => {
        expect(toUpper(ref('abc'))).toBe('ABC');
    });
});
