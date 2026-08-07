import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { pad } from './pad';

describe('pad', () => {
    it('distribui o preenchimento entre início e fim (peculiaridade)', () => {
        expect(pad('abc', 8)).toBe('  abc   ');
    });

    it('aceita caracteres de preenchimento customizados', () => {
        expect(pad('abc', 8, '_-')).toBe('_-abc_-_');
    });

    it('não altera a string quando já atinge o comprimento desejado', () => {
        expect(pad('abc', 3)).toBe('abc');
        expect(pad('abc', 2)).toBe('abc');
    });

    it('retorna a string original sem length', () => {
        expect(pad('abc')).toBe('abc');
    });

    it('funciona com Ref', () => {
        expect(pad(ref('abc'), ref(8))).toBe('  abc   ');
    });

    it('conta por code point Unicode, não por unidade UTF-16 (peculiaridade: caracteres astrais)', () => {
        expect(pad('🎉', 5, '_')).toBe('__🎉__');
        expect(pad('x', 4, '🎉')).toBe('🎉x🎉🎉');
    });
});
