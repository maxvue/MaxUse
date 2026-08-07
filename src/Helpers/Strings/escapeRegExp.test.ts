import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { escapeRegExp } from './escapeRegExp';

describe('escapeRegExp', () => {
    it('escapa caracteres especiais de regex (peculiaridade)', () => {
        expect(escapeRegExp('a.b*c+d?')).toBe('a\\.b\\*c\\+d\\?');
    });

    it('permite construir um RegExp seguro a partir do resultado', () => {
        const re = new RegExp(escapeRegExp('a.b'));
        expect(re.test('a.b')).toBe(true);
        expect(re.test('axb')).toBe(false);
    });

    it('retorna string vazia para null e undefined', () => {
        expect(escapeRegExp(null)).toBe('');
        expect(escapeRegExp(undefined)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(escapeRegExp(ref('a+b'))).toBe('a\\+b');
    });
});
