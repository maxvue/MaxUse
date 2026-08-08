import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toLower } from './toLower';

describe('toLower', () => {
    it('converte string para minúsculas', () => {
        expect(toLower('ABC')).toBe('abc');
    });

    it('retorna string vazia para null e undefined (peculiaridade)', () => {
        expect(toLower(null)).toBe('');
        expect(toLower(undefined)).toBe('');
    });

    it('converte número para string antes de aplicar toLowerCase', () => {
        expect(toLower(123)).toBe('123');
    });

    it('funciona com Ref', () => {
        expect(toLower(ref('ABC'))).toBe('abc');
    });
});
