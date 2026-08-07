import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { upperCase } from './upperCase';

describe('upperCase', () => {
    it('converte para palavras separadas por espaço, maiúsculas', () => {
        expect(upperCase('--foo-bar--')).toBe('FOO BAR');
    });

    it('separa palavras em camelCase', () => {
        expect(upperCase('fooBar')).toBe('FOO BAR');
    });

    it('coage número para string antes de processar', () => {
        expect(upperCase(123)).toBe('123');
    });

    it('retorna vazio para string vazia ou null', () => {
        expect(upperCase('')).toBe('');
        expect(upperCase(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(upperCase(ref('foo_bar'))).toBe('FOO BAR');
    });
});
