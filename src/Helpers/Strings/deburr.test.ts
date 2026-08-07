import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { deburr } from './deburr';

describe('deburr', () => {
    it('remove acentos comuns', () => {
        expect(deburr('déjà vu')).toBe('deja vu');
        expect(deburr('São Paulo')).toBe('Sao Paulo');
    });

    it('converte ligaduras latinas para seus equivalentes ASCII (peculiaridade)', () => {
        expect(deburr('Æther')).toBe('Aether');
        expect(deburr('œuf')).toBe('oeuf');
        expect(deburr('straße')).toBe('strasse');
    });

    it('mantém strings já sem acento intactas', () => {
        expect(deburr('abc')).toBe('abc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(deburr(null)).toBe('');
        expect(deburr(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(deburr(ref('café'))).toBe('cafe');
    });
});
