import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { words } from './words';

describe('words', () => {
    it('divide string com pontuação em palavras', () => {
        expect(words('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
    });

    it('detecta transições de camelCase (peculiaridade)', () => {
        expect(words('fredBarneyPebbles')).toEqual(['fred', 'Barney', 'Pebbles']);
        expect(words('camelCase')).toEqual(['camel', 'Case']);
    });

    it('separa siglas maiúsculas de palavras seguintes', () => {
        expect(words('ABCWord')).toEqual(['ABC', 'Word']);
    });

    it('separa dígitos colados a letras', () => {
        expect(words('123abc')).toEqual(['123', 'abc']);
    });

    it('aceita pattern customizado, ignorando a detecção automática', () => {
        expect(words('fred, barney, & pebbles', /[^, ]+/g)).toEqual(['fred', 'barney', '&', 'pebbles']);
    });

    it('retorna array vazio para string vazia, null e undefined', () => {
        expect(words('')).toEqual([]);
        expect(words(null)).toEqual([]);
        expect(words(undefined)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(words(ref('fooBar'))).toEqual(['foo', 'Bar']);
    });
});
