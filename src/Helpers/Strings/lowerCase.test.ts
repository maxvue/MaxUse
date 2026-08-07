import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lowerCase } from './lowerCase';

describe('lowerCase', () => {
    it('converte para palavras separadas por espaço, minúsculas', () => {
        expect(lowerCase('--Foo-Bar--')).toBe('foo bar');
    });

    it('separa palavras em camelCase', () => {
        expect(lowerCase('fooBar')).toBe('foo bar');
    });

    it('separa palavras em snake_case com múltiplos underscores', () => {
        expect(lowerCase('__FOO_BAR__')).toBe('foo bar');
    });

    it('peculiaridade: remove apóstrofos antes de separar as palavras', () => {
        expect(lowerCase('it\'s a test')).toBe('its a test');
    });

    it('retorna vazio para string vazia ou null', () => {
        expect(lowerCase('')).toBe('');
        expect(lowerCase(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(lowerCase(ref('FOO_BAR'))).toBe('foo bar');
    });
});
