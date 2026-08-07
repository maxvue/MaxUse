import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { trim } from './trim';

describe('trim', () => {
    it('remove espaços em branco do início e fim', () => {
        expect(trim('  abc  ')).toBe('abc');
    });

    it('remove conjunto de caracteres customizado (peculiaridade)', () => {
        expect(trim('-_-abc-_-', '_-')).toBe('abc');
    });

    it('não remove nada quando chars é string vazia (peculiaridade)', () => {
        expect(trim('  abc  ', '')).toBe('  abc  ');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(trim(null)).toBe('');
        expect(trim(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(trim(ref('  abc  '))).toBe('abc');
    });

    it('converte chars não-string para string antes de usar como conjunto de remoção', () => {
        expect(trim('0abc0', 0 as unknown as string)).toBe('abc');
    });
});
