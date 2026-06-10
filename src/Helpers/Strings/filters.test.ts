import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { onlyLetters, onlyNumbers, onlySymbols, onlyLettersAndNumbers, removeSpaces } from './filters';

describe('onlyLetters', () => {
    it('remove números e símbolos', () => {
        expect(onlyLetters('abc123!@#')).toBe('abc');
    });

    it('mantém acentos', () => {
        expect(onlyLetters('café123')).toBe('café');
    });

    it('mantém espaços quando space=true', () => {
        expect(onlyLetters('hello 123 world', true)).toBe('hello  world');
    });

    it('retorna vazio para null', () => {
        expect(onlyLetters(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(onlyLetters(ref('abc123'))).toBe('abc');
    });
});

describe('onlyNumbers', () => {
    it('remove letras e símbolos', () => {
        expect(onlyNumbers('abc123def456')).toBe('123456');
    });

    it('mantém espaços quando space=true', () => {
        expect(onlyNumbers('12 34', true)).toBe('12 34');
    });

    it('retorna vazio para null', () => {
        expect(onlyNumbers(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(onlyNumbers(ref('(11) 99999-1234'))).toBe('11999991234');
    });
});

describe('onlySymbols', () => {
    it('mantém apenas símbolos/pontuação', () => {
        expect(onlySymbols('hello!@#world')).toBe('!@#');
    });

    it('retorna vazio para string alfanumérica', () => {
        expect(onlySymbols('abc123')).toBe('');
    });

    it('retorna vazio para null', () => {
        expect(onlySymbols(null)).toBe('');
    });
});

describe('onlyLettersAndNumbers', () => {
    it('remove símbolos', () => {
        expect(onlyLettersAndNumbers('hello!@#123')).toBe('hello123');
    });

    it('mantém acentos', () => {
        expect(onlyLettersAndNumbers('café!99')).toBe('café99');
    });

    it('mantém espaços quando space=true', () => {
        expect(onlyLettersAndNumbers('hello! world@', true)).toBe('hello world');
    });

    it('retorna vazio para null', () => {
        expect(onlyLettersAndNumbers(null)).toBe('');
    });
});

describe('removeSpaces', () => {
    it('remove todos os espaços', () => {
        expect(removeSpaces('hello world')).toBe('helloworld');
    });

    it('remove múltiplos espaços', () => {
        expect(removeSpaces('a  b   c')).toBe('abc');
    });

    it('remove tabs e newlines', () => {
        expect(removeSpaces('a\tb\nc')).toBe('abc');
    });

    it('retorna vazio para null', () => {
        expect(removeSpaces(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(removeSpaces(ref('h e l l o'))).toBe('hello');
    });
});
