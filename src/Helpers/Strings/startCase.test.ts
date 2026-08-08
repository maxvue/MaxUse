import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { startCase } from './startCase';

describe('startCase', () => {
    it('capitaliza cada palavra de uma frase simples', () => {
        expect(startCase('foo bar')).toBe('Foo Bar');
    });

    it('trata kebab-case e separadores repetidos', () => {
        expect(startCase('--foo-bar--')).toBe('Foo Bar');
    });

    it('separa camelCase em palavras', () => {
        expect(startCase('fooBar')).toBe('Foo Bar');
    });

    it('separa snake_case em palavras', () => {
        expect(startCase('foo_bar')).toBe('Foo Bar');
    });

    it('separa números como palavras próprias', () => {
        expect(startCase('foo1bar')).toBe('Foo 1 Bar');
    });

    it('separa siglas coladas a palavras', () => {
        expect(startCase('XMLHttpRequest')).toBe('XML Http Request');
    });

    it('mantém o restante da palavra intacto (não faz lowercase)', () => {
        expect(startCase('FOO BAR')).toBe('FOO BAR');
    });

    it('remove acentos via deburr', () => {
        expect(startCase('são paulo')).toBe('Sao Paulo');
    });

    it('remove apóstrofos em vez de quebrar a palavra', () => {
        expect(startCase('d\'água')).toBe('Dagua');
    });

    it('colapsa espaços múltiplos e das bordas', () => {
        expect(startCase('  a  b  ')).toBe('A B');
    });

    it('retorna string vazia para null e undefined', () => {
        expect(startCase(null)).toBe('');
        expect(startCase(undefined)).toBe('');
    });

    it('retorna string vazia para string vazia', () => {
        expect(startCase('')).toBe('');
    });

    it('converte número para string', () => {
        expect(startCase(42)).toBe('42');
    });

    it('trata tipos errados coagindo para string (objeto, array, boolean)', () => {
        expect(startCase({})).toBe('Object Object');
        expect(startCase(['a', 'b'])).toBe('A B');
        expect(startCase(true)).toBe('True');
    });

    it('funciona com Ref', () => {
        expect(startCase(ref('foo bar'))).toBe('Foo Bar');
    });

    it('reproduz o call site real de Pesquisa.vue:202 (_.startCase(...).toUpperCase())', () => {
        // Formato real: `system?.props?.data?.distrito` é o nome de um distrito
        // vindo da API, e o resultado alimenta `.toUpperCase()` — por isso o
        // retorno precisa ser SEMPRE string, nunca undefined, mesmo quando o
        // optional chaining entrega undefined.
        const distrito = 'jardim são joão';
        expect(startCase(distrito).toUpperCase()).toBe('JARDIM SAO JOAO');

        // O caso que o optional chaining produz quando a chave não existe:
        // precisa ser string vazia para o .toUpperCase() não estourar.
        expect(() => startCase(undefined).toUpperCase()).not.toThrow();
        expect(startCase(undefined).toUpperCase()).toBe('');
    });
});
