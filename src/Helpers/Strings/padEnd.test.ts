import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { padEnd } from './padEnd';

describe('padEnd', () => {
    it('preenche só o fim (peculiaridade)', () => {
        expect(padEnd('abc', 6)).toBe('abc   ');
    });

    it('aceita caracteres de preenchimento customizados', () => {
        expect(padEnd('abc', 6, '_-')).toBe('abc_-_');
    });

    it('não altera a string quando já atinge o comprimento desejado', () => {
        expect(padEnd('abc', 3)).toBe('abc');
    });

    it('funciona com Ref', () => {
        expect(padEnd(ref('abc'), ref(6))).toBe('abc   ');
    });

    it('conta por code point Unicode, não por unidade UTF-16 (peculiaridade: caracteres astrais)', () => {
        expect(padEnd('🎉', 3, '_')).toBe('🎉__');
    });
});
