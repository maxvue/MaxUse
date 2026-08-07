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

    it('mapeia ŉ para o dígrafo apóstrofo+n, não apenas "n" (peculiaridade)', () => {
        expect(deburr('ŉ')).toBe('\'n');
    });

    it('não altera caracteres fora do Latin-1 Supplement / Latin Extended-A, ainda que acentuados (peculiaridade: tabela fechada, não normalize NFD genérico)', () => {
        expect(deburr('ș ț')).toBe('ș ț');
        expect(deburr('Việt Nam')).toBe('Việt Nam');
    });
});
