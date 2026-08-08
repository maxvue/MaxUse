import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { trimEnd } from './trimEnd';

describe('trimEnd', () => {
    it('remove espaços em branco só do fim (peculiaridade)', () => {
        expect(trimEnd('  abc  ')).toBe('  abc');
    });

    it('remove conjunto de caracteres customizado do fim', () => {
        expect(trimEnd('abc-_-', '_-')).toBe('abc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(trimEnd(null)).toBe('');
        expect(trimEnd(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(trimEnd(ref('abc  '))).toBe('abc');
    });

    it('converte chars não-string para string antes de usar como conjunto de remoção', () => {
        expect(trimEnd('abc0', 0 as unknown as string)).toBe('abc');
    });
});
