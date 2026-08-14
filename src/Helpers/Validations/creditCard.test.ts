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

    it('aceita Hipercard válido', () => {
        expect(isValidCreditCard('6062825624254001')).toBe(true);
    });

    it('continua rejeitando Luhn inválido', () => {
        expect(isValidCreditCard('4514160123456789')).toBe(false);
    });

    describe('bandeira Elo', () => {
        const faixas: Array<[string, string]> = [
            ['401178', '4011780000000006'],
            ['401179', '4011790000000005'],
            ['431274', '4312740000000006'],
            ['438935', '4389350000000002'],
            ['451416', '4514160000000003'],
            ['457393', '4573930000000007'],
            ['457631', '4576310000000009'],
            ['457632', '4576320000000008'],
            ['504175', '5041750000000000'],
            ['506699', '5066990000000002'],
            ['506778', '5067780000000006'],
            ['509000', '5090000000000000'],
            ['509999', '5099990000000003'],
            ['627780', '6277800000000006'],
            ['636297', '6362970000000003'],
            ['636368', '6363680000000007'],
            ['650031', '6500310000000005'],
            ['650051', '6500510000000000'],
            ['650405', '6504050000000003'],
            ['650439', '6504390000000003'],
            ['650485', '6504850000000006'],
            ['650538', '6505380000000003'],
            ['650541', '6505410000000008'],
            ['650598', '6505980000000000'],
            ['650700', '6507000000000005'],
            ['650718', '6507180000000005'],
            ['650720', '6507200000000001'],
            ['650727', '6507270000000004'],
            ['650901', '6509010000000002'],
            ['650978', '6509780000000000'],
            ['651652', '6516520000000001'],
            ['651679', '6516790000000000'],
            ['655000', '6550000000000001'],
            ['655019', '6550190000000000'],
            ['655021', '6550210000000006'],
            ['655058', '6550580000000002']
        ];

        it.each(faixas)('aceita cartão Elo da faixa %s', (_bin, numero) => {
            expect(isValidCreditCard(numero)).toBe(true);
        });

        it('rejeita cartão Elo com Luhn inválido', () => {
            expect(isValidCreditCard('6550000000000000')).toBe(false);
            expect(isValidCreditCard('6500310000000004')).toBe(false);
        });
    });

    it('aceita as faixas de Hipercard', () => {
        expect(isValidCreditCard('6062820000000003')).toBe(true);
        expect(isValidCreditCard('3841000000000007')).toBe(true);
        expect(isValidCreditCard('3841990000000009')).toBe(true);
    });

    it('não regride Visa e Mastercard', () => {
        expect(isValidCreditCard('4111111111111111')).toBe(true);
        expect(isValidCreditCard('5555555555554444')).toBe(true);
    });
});
