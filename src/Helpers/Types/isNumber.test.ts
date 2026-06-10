import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isNumber, isNumeric } from './isNumber';

describe('isNumber', () => {
    it('retorna true para inteiro', () => {
        expect(isNumber(42)).toBe(true);
    });

    it('retorna true para float', () => {
        expect(isNumber(3.14)).toBe(true);
    });

    it('retorna true para zero', () => {
        expect(isNumber(0)).toBe(true);
    });

    it('retorna true para negativo', () => {
        expect(isNumber(-5)).toBe(true);
    });

    it('retorna true para string numérica', () => {
        expect(isNumber('123')).toBe(true);
        expect(isNumber('3.14')).toBe(true);
    });

    it('retorna false para NaN', () => {
        expect(isNumber(NaN)).toBe(false);
    });

    it('retorna false para string vazia', () => {
        expect(isNumber('')).toBe(false);
    });

    it('retorna false para string com espaços', () => {
        expect(isNumber('   ')).toBe(false);
    });

    it('retorna false para string de texto', () => {
        expect(isNumber('abc')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isNumber(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(isNumber(undefined)).toBe(false);
    });

    it('retorna false para boolean true', () => {
        expect(isNumber(true)).toBe(false);
    });

    it('retorna false para boolean false', () => {
        expect(isNumber(false)).toBe(false);
    });

    it('retorna true para Infinity', () => {
        expect(isNumber(Infinity)).toBe(true);
    });

    // Reatividade
    it('funciona com Ref', () => {
        expect(isNumber(ref(42))).toBe(true);
        expect(isNumber(ref('abc'))).toBe(false);
    });

    it('funciona com Getter', () => {
        expect(isNumber(() => 100)).toBe(true);
        expect(isNumber(() => null)).toBe(false);
    });
});

describe('isNumeric (alias)', () => {
    it('é funcional como alias de isNumber', () => {
        expect(isNumeric(42)).toBe(true);
        expect(isNumeric('abc')).toBe(false);
    });
});
