import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isValidCreditCard } from './creditCard';

describe('isValidCreditCard', () => {
    it('valida número de cartão Visa válido', () => {
        expect(isValidCreditCard('4111111111111111')).toBe(true);
    });

    it('valida número de cartão Mastercard válido', () => {
        expect(isValidCreditCard('5500005555555559')).toBe(true);
    });

    it('aceita número com espaços e traços', () => {
        expect(isValidCreditCard('4111-1111-1111-1111')).toBe(true);
    });

    it('rejeita número curto', () => {
        expect(isValidCreditCard('1234')).toBe(false);
    });

    it('rejeita número que não corresponde a nenhuma bandeira', () => {
        expect(isValidCreditCard('0000000000000000')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isValidCreditCard(null)).toBe(false);
    });

    it('retorna false para undefined', () => {
        expect(isValidCreditCard(undefined)).toBe(false);
    });

    it('retorna false para string vazia', () => {
        expect(isValidCreditCard('')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isValidCreditCard(ref('4111111111111111'))).toBe(true);
    });

    it('funciona com Getter', () => {
        expect(isValidCreditCard(() => '4111111111111111')).toBe(true);
    });

    it('rejeita cartões com dígito verificador Luhn inválido', () => {
        expect(isValidCreditCard('4111111111111112')).toBe(false);
        expect(isValidCreditCard('5500005555555558')).toBe(false);
        expect(isValidCreditCard('1234567890123456')).toBe(false);
    });
});
