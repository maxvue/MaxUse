import { describe, it, expect } from 'vitest';
import { isValid, isNotValid, isEmpty, notEmpty, isNotEmpty, empty, noEmpty, notHasValidContent } from './isValid';

describe('isValid', () => {
    it('retorna true para valor não-nulo', () => {
        expect(isValid('hello')).toBe(true);
        expect(isValid(0)).toBe(true);
        expect(isValid(false)).toBe(true);
        expect(isValid('')).toBe(true);
    });

    it('retorna false para null', () => {
        expect(isValid(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(isValid(undefined)).toBe(false);
    });
});

describe('isNotValid', () => {
    it('retorna true para null', () => {
        expect(isNotValid(null)).toBe(true);
    });

    it('retorna true para undefined', () => {
        expect(isNotValid(undefined)).toBe(true);
    });

    it('retorna false para valor válido', () => {
        expect(isNotValid('hello')).toBe(false);
    });
});

describe('isEmpty', () => {
    it('retorna true para string vazia', () => {
        expect(isEmpty('')).toBe(true);
    });

    it('retorna true para array vazio', () => {
        expect(isEmpty([])).toBe(true);
    });

    it('retorna false para string com conteúdo', () => {
        expect(isEmpty('hello')).toBe(false);
    });

    it('retorna false para array com itens', () => {
        expect(isEmpty([1])).toBe(false);
    });

    it('retorna false para números e primitivos booleanos (fallback return false)', () => {
        expect(isEmpty(42)).toBe(false);
        expect(isEmpty(true)).toBe(false);
    });
});

describe('notEmpty / isNotEmpty / noEmpty', () => {
    it('retorna true para string com conteúdo', () => {
        expect(notEmpty('hello')).toBe(true);
        expect(isNotEmpty('hello')).toBe(true);
        expect(noEmpty('hello')).toBe(true);
    });

    it('retorna false para string vazia', () => {
        expect(notEmpty('')).toBe(false);
        expect(isNotEmpty('')).toBe(false);
        expect(noEmpty('')).toBe(false);
    });

    it('retorna true para números e booleanos', () => {
        expect(notEmpty(0)).toBe(true);
        expect(notEmpty(42)).toBe(true);
        expect(notEmpty(true)).toBe(true);
        expect(notEmpty(false)).toBe(true);

        expect(isNotEmpty(0)).toBe(true);
        expect(isNotEmpty(42)).toBe(true);
        expect(isNotEmpty(true)).toBe(true);
        expect(isNotEmpty(false)).toBe(true);

        expect(noEmpty(0)).toBe(true);
        expect(noEmpty(42)).toBe(true);
        expect(noEmpty(true)).toBe(true);
        expect(noEmpty(false)).toBe(true);
    });
});

describe('empty', () => {
    it('retorna true para null', () => {
        expect(empty(null)).toBe(true);
    });

    it('retorna false para valor com conteúdo', () => {
        expect(empty('texto')).toBe(false);
    });

    it('retorna false para números e booleanos', () => {
        expect(empty(0)).toBe(false);
        expect(empty(42)).toBe(false);
        expect(empty(true)).toBe(false);
        expect(empty(false)).toBe(false);
    });
});

describe('notHasValidContent', () => {
    it('retorna true para null', () => {
        expect(notHasValidContent(null)).toBe(true);
    });

    it('retorna false para valor válido', () => {
        expect(notHasValidContent('hello')).toBe(false);
    });
});
