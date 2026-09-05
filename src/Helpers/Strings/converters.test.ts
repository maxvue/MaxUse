import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { toSearchableString, toNumber, parseBrNumber } from './converters';

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

describe('parseBrNumber', () => {
    it('converte corretamente números no padrão internacional com separador de milhar e decimal', () => {
        expect(parseBrNumber('1,234.56')).toBe(1234.56);
        expect(parseBrNumber('1,234,567.89')).toBe(1234567.89);
        expect(parseBrNumber('-1,234.56')).toBe(-1234.56);
    });

    it('converte valores com prefixo monetário R$ e separador internacional', () => {
        expect(parseBrNumber('R$ 1,234.56')).toBe(1234.56);
    });

    it('converte valores com sufixos de bytes e separador internacional', () => {
        expect(parseBrNumber('1,234.56 MB')).toBe(1234.56);
    });

    it('mantém conversão correta para o padrão pt-BR com vírgula decimal', () => {
        expect(parseBrNumber('1.234,56')).toBe(1234.56);
        expect(parseBrNumber('1.234.567,89')).toBe(1234567.89);
        expect(parseBrNumber('1234,56')).toBe(1234.56);
        expect(parseBrNumber('1,5')).toBe(1.5);
        expect(parseBrNumber('0,25')).toBe(0.25);
        expect(parseBrNumber(',5')).toBe(0.5);
        expect(parseBrNumber('-1.234,56')).toBe(-1234.56);
        expect(parseBrNumber('R$ 1.234,56')).toBe(1234.56);
        expect(parseBrNumber('1.234,56 KB')).toBe(1234.56);
    });

    it('trata milhar pt-BR sem casas decimais', () => {
        expect(parseBrNumber('1.234')).toBe(1234);
        expect(parseBrNumber('1.234.567')).toBe(1234567);
        expect(parseBrNumber('-1.234')).toBe(-1234);
    });

    it('converte padrão decimal comum com ponto', () => {
        expect(parseBrNumber('1234.56')).toBe(1234.56);
        expect(parseBrNumber('3.14')).toBe(3.14);
        expect(parseBrNumber('.5')).toBe(0.5);
    });

    it('aceita números primitivos diretamente', () => {
        expect(parseBrNumber(1234.56)).toBe(1234.56);
        expect(parseBrNumber(0)).toBe(0);
        expect(parseBrNumber(-42)).toBe(-42);
    });

    it('converte notação científica', () => {
        expect(parseBrNumber('2e3')).toBe(2000);
        expect(parseBrNumber('-1.5e-2')).toBe(-0.015);
    });

    it('retorna NaN para entradas inválidas, vazias ou não-finitas', () => {
        expect(parseBrNumber(null)).toBeNaN();
        expect(parseBrNumber(undefined)).toBeNaN();
        expect(parseBrNumber('')).toBeNaN();
        expect(parseBrNumber('   ')).toBeNaN();
        expect(parseBrNumber(Infinity)).toBeNaN();
        expect(parseBrNumber(-Infinity)).toBeNaN();
        expect(parseBrNumber('abc')).toBeNaN();
        expect(parseBrNumber('12a34')).toBeNaN();
    });
});

