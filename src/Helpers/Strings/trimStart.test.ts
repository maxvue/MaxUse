import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { trimStart } from './trimStart';

describe('trimStart', () => {
    it('remove espaços em branco só do início (peculiaridade)', () => {
        expect(trimStart('  abc  ')).toBe('abc  ');
    });

    it('remove conjunto de caracteres customizado do início', () => {
        expect(trimStart('-_-abc', '_-')).toBe('abc');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(trimStart(null)).toBe('');
        expect(trimStart(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(trimStart(ref('  abc'))).toBe('abc');
    });
});
