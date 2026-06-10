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

    // Reatividade
    it('funciona com Ref', () => {
        expect(capitalize(ref('world'))).toBe('World');
    });
});
