import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toSearchableString, toNumber } from './converters';

describe('toSearchableString', () => {
    it('remove acentos e converte para minúsculas', () => {
        expect(toSearchableString('Café com Leite')).toBe('cafecomleite');
    });

    it('remove caracteres especiais', () => {
        expect(toSearchableString('hello!@#world')).toBe('helloworld');
    });

    it('mantém números', () => {
        expect(toSearchableString('test123')).toBe('test123');
    });

    it('retorna vazio para null', () => {
        expect(toSearchableString(null)).toBe('');
    });

    it('retorna vazio para string vazia', () => {
        expect(toSearchableString('')).toBe('');
    });

    it('funciona com Ref', () => {
        expect(toSearchableString(ref('João'))).toBe('joao');
    });
});

describe('toNumber', () => {
    it('converte string numérica para número', () => {
        expect(toNumber('42')).toBe(42);
    });

    it('converte float string para número', () => {
        expect(toNumber('3.14')).toBe(3.14);
    });

    it('arredonda para N casas decimais', () => {
        expect(toNumber('3.14159', 2)).toBe(3.14);
    });

    it('retorna 0 para null', () => {
        expect(toNumber(null)).toBe(0);
    });

    it('retorna 0 para string não-numérica', () => {
        expect(toNumber('abc')).toBe(0);
    });

    it('retorna 0 para string vazia', () => {
        expect(toNumber('')).toBe(0);
    });

    it('converte número diretamente', () => {
        expect(toNumber(42)).toBe(42);
    });

    it('funciona com Ref', () => {
        expect(toNumber(ref('99.9'), 0)).toBe(100);
    });
});

describe('toNumber — regressão auditoria (achado 015)', () => {
    it('converte decimais em formato pt-BR', () => {
        expect(toNumber('1,5')).toBe(1.5);
        expect(toNumber('1.234,56')).toBe(1234.56);
        expect(toNumber('0,25')).toBe(0.25);
    });

    it('mantém compatibilidade com formato internacional', () => {
        expect(toNumber('1234.56')).toBe(1234.56);
        expect(toNumber('1,234.56')).toBe(1234.56);
        expect(toNumber(42)).toBe(42);
    });

    it('respeita o parâmetro decimals com entrada pt-BR', () => {
        expect(toNumber('1.234,567', 2)).toBe(1234.57);
    });

    it('retorna 0 para entradas realmente inválidas', () => {
        expect(toNumber('abc')).toBe(0);
        expect(toNumber(null)).toBe(0);
    });
});
