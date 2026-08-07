import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { split } from './split';

describe('split', () => {
    it('divide a string pelo separador', () => {
        expect(split('a-b-c', '-')).toEqual(['a', 'b', 'c']);
    });

    it('respeita o limite de elementos (peculiaridade)', () => {
        expect(split('a-b-c', '-', 2)).toEqual(['a', 'b']);
    });

    it('divide em caracteres individuais quando separator é string vazia', () => {
        expect(split('abc', '')).toEqual(['a', 'b', 'c']);
    });

    it('aceita separador RegExp', () => {
        expect(split('a1b2c3', /\d/)).toEqual(['a', 'b', 'c', '']);
    });

    it('retorna array vazio para null e undefined', () => {
        expect(split(null)).toEqual(['']);
    });

    it('funciona com Ref', () => {
        expect(split(ref('a-b'), ref('-'))).toEqual(['a', 'b']);
    });

    it('divide por code point Unicode com separador vazio, não por unidade UTF-16 (peculiaridade: caracteres astrais)', () => {
        expect(split('a🎉b', '')).toEqual(['a', '🎉', 'b']);
    });
});
