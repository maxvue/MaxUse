import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { hasContent, hasContentFn } from './hasContent';

describe('hasContentFn', () => {
    // Valores sem conteúdo
    it('retorna false para null', () => {
        expect(hasContentFn(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(hasContentFn(undefined)).toBe(false);
    });

    it('retorna false para string vazia', () => {
        expect(hasContentFn('')).toBe(false);
    });

    it('retorna false para string com apenas espaços', () => {
        expect(hasContentFn('   ')).toBe(false);
    });

    it('retorna false para string "null"', () => {
        expect(hasContentFn('null')).toBe(false);
    });

    it('retorna false para string "NULL"', () => {
        expect(hasContentFn('NULL')).toBe(false);
    });

    it('retorna false para string "undefined"', () => {
        expect(hasContentFn('undefined')).toBe(false);
    });

    it('retorna false para string "UNDEFINED"', () => {
        expect(hasContentFn('UNDEFINED')).toBe(false);
    });

    // Número 0 — comportamento especial
    it('retorna false para 0 quando if_zero é false (padrão)', () => {
        expect(hasContentFn(0)).toBe(false);
    });

    it('retorna true para 0 quando if_zero é true', () => {
        expect(hasContentFn(0, true)).toBe(true);
    });

    // Valores com conteúdo
    it('retorna true para string com texto', () => {
        expect(hasContentFn('hello')).toBe(true);
    });

    it('retorna true para número diferente de 0', () => {
        expect(hasContentFn(42)).toBe(true);
        expect(hasContentFn(-1)).toBe(true);
    });

    // Reatividade Vue
    it('funciona com Ref', () => {
        expect(hasContentFn(ref('hello'))).toBe(true);
        expect(hasContentFn(ref(''))).toBe(false);
    });

    // Map e Set
    it('retorna true para Map com itens', () => {
        expect(hasContentFn(new Map([['a', 1]]))).toBe(true);
    });

    it('retorna false para Map vazio', () => {
        expect(hasContentFn(new Map())).toBe(false);
    });

    it('retorna true para Set com itens', () => {
        expect(hasContentFn(new Set([1]))).toBe(true);
    });

    it('retorna false para Set vazio', () => {
        expect(hasContentFn(new Set())).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(hasContentFn(() => 'hello')).toBe(true);
        expect(hasContentFn(() => null)).toBe(false);
    });

    it('retorna length para objeto disfarçado de Object que não é typeof object', () => {
        const fn = function(a: any) {};
        fn.toString = () => '[object Object]';
        // Passar como getter para o toValue retornar a função ao invés de executá-la e retornar undefined
        expect(hasContentFn(() => fn)).toBe(true);
    });
});

describe('hasContent (type-guard)', () => {
    it('retorna true para valor com conteúdo', () => {
        expect(hasContent('texto')).toBe(true);
    });

    it('retorna false para null', () => {
        expect(hasContent(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(hasContent(undefined)).toBe(false);
    });

    it('lida com if_zero corretamente', () => {
        expect(hasContent(0, false)).toBe(false);
        expect(hasContent(0, true)).toBe(true);
    });
});
