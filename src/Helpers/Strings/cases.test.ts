import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { snakeCase, kebabCase, camelCase, capitalize } from './cases';

describe('snakeCase', () => {
    it('converte camelCase para snake_case', () => {
        expect(snakeCase('helloWorld')).toBe('hello_world');
    });

    it('converte PascalCase para snake_case', () => {
        expect(snakeCase('HelloWorld')).toBe('hello_world');
    });

    it('converte string com espaços para snake_case', () => {
        expect(snakeCase('hello world test')).toBe('hello_world_test');
    });

    it('retorna string vazia para null', () => {
        expect(snakeCase(null)).toBe('');
    });

    it('retorna string vazia para string vazia', () => {
        expect(snakeCase('')).toBe('');
    });

    it('retorna string vazia se não houver letras/números (ex: apenas símbolos)', () => {
        expect(snakeCase('!!!')).toBe('');
    });

    it('preserva siglas maiúsculas como uma única palavra', () => {
        expect(snakeCase('FOO_BAR')).toBe('foo_bar');
        expect(snakeCase('__FOO_BAR__')).toBe('foo_bar');
        expect(snakeCase('MAX_SAFE_INTEGER')).toBe('max_safe_integer');
        expect(snakeCase('CPF_CLIENTE')).toBe('cpf_cliente');
    });

    it('separa dígitos colados a letras como o Lodash', () => {
        expect(snakeCase('HTML5Parser')).toBe('html_5_parser');
        expect(snakeCase('text123text')).toBe('text_123_text');
    });

    it('converte valores falsy não nulos via toString', () => {
        expect(snakeCase(0)).toBe('0');
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(snakeCase(ref('helloWorld'))).toBe('hello_world');
    });
});

describe('kebabCase', () => {
    it('converte camelCase para kebab-case', () => {
        expect(kebabCase('helloWorld')).toBe('hello-world');
    });

    it('converte string com espaços para kebab-case', () => {
        expect(kebabCase('hello world')).toBe('hello-world');
    });

    it('retorna string vazia para null', () => {
        expect(kebabCase(null)).toBe('');
    });

    it('retorna string vazia se não houver letras/números (ex: apenas símbolos)', () => {
        expect(kebabCase('!!!')).toBe('');
    });

    it('preserva siglas maiúsculas como uma única palavra', () => {
        expect(kebabCase('FOO_BAR')).toBe('foo-bar');
        expect(kebabCase('MAX_SAFE_INTEGER')).toBe('max-safe-integer');
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(kebabCase(ref('MyComponent'))).toBe('my-component');
    });
});

describe('camelCase', () => {
    it('converte snake_case para camelCase', () => {
        expect(camelCase('hello_world')).toBe('helloWorld');
    });

    it('converte kebab-case para camelCase', () => {
        expect(camelCase('hello-world')).toBe('helloWorld');
    });

    it('converte string com espaços para camelCase', () => {
        expect(camelCase('hello world')).toBe('helloWorld');
    });

    it('retorna string vazia para null', () => {
        expect(camelCase(null)).toBe('');
    });

    it('retorna string vazia para string vazia', () => {
        expect(camelCase('')).toBe('');
    });

    it('retorna string vazia se não houver letras/números (ex: apenas símbolos)', () => {
        expect(camelCase('!!!')).toBe('');
    });

    it('preserva siglas maiúsculas como uma única palavra', () => {
        expect(camelCase('__FOO_BAR__')).toBe('fooBar');
        expect(camelCase('MAX_SAFE_INTEGER')).toBe('maxSafeInteger');
    });

    it('trata contrações com apóstrofo como um único token', () => {
        expect(camelCase('O\'Brien\'s Car')).toBe('oBriensCar');
    });

    it('desacentua e expande ß antes de tokenizar', () => {
        expect(camelCase('ß straße')).toBe('ssStrasse');
    });

    it('converte valores falsy não nulos via toString', () => {
        expect(camelCase(0)).toBe('0');
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(camelCase(ref('my_variable'))).toBe('myVariable');
    });
});

describe('capitalize', () => {
    it('capitaliza primeira letra e minúscula o resto', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('converte MAIÚSCULAS para capitalizado', () => {
        expect(capitalize('HELLO')).toBe('Hello');
    });

    it('retorna string vazia para null', () => {
        expect(capitalize(null)).toBe('');
    });

    it('retorna string vazia para string vazia', () => {
        expect(capitalize('')).toBe('');
    });

    it('converte valores falsy não nulos via toString', () => {
        expect(capitalize(0)).toBe('0');
        expect(capitalize(' ')).toBe(' ');
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(capitalize(ref('world'))).toBe('World');
    });
});
