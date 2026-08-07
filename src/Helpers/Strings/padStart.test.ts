import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { padStart } from './padStart';

describe('padStart', () => {
    it('preenche só o início (peculiaridade)', () => {
        expect(padStart('abc', 6)).toBe('   abc');
    });

    it('aceita caracteres de preenchimento customizados', () => {
        expect(padStart('abc', 6, '_-')).toBe('_-_abc');
    });

    it('não altera a string quando já atinge o comprimento desejado', () => {
        expect(padStart('abc', 3)).toBe('abc');
    });

    it('funciona com Ref', () => {
        expect(padStart(ref('abc'), ref(6))).toBe('   abc');
    });

    it('conta por code point Unicode, não por unidade UTF-16 (peculiaridade: caracteres astrais)', () => {
        expect(padStart('🎉', 3, '_')).toBe('__🎉');
    });
});
