import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isCpf, isCnpj, isCpfCnpj } from './documents';

describe('isCpf', () => {
    it('valida CPF válido', () => {
        expect(isCpf('52998224725')).toBe(true);
    });

    it('rejeita CPF com todos dígitos iguais', () => {
        expect(isCpf('11111111111')).toBe(false);
    });

    it('rejeita CPF inválido', () => {
        expect(isCpf('12345678901')).toBe(false);
    });

    it('aceita CPF com máscara', () => {
        expect(isCpf('529.982.247-25')).toBe(true);
    });

    it('retorna false para null, undefined e string vazia sem lançar exceção', () => {
        expect(isCpf(null)).toBe(false);
        expect(isCpf(undefined)).toBe(false);
        expect(isCpf('')).toBe(false);
    });

    it('aceita CPF como number com ou sem zero à esquerda', () => {
        expect(isCpf(52998224725)).toBe(true);
    });

    it('rejeita CPF de tamanhos errados', () => {
        expect(isCpf('5299822472')).toBe(false);
        expect(isCpf('529982247251')).toBe(false);
    });
});

describe('isCnpj', () => {
    it('valida CNPJ válido', () => {
        expect(isCnpj('11222333000181')).toBe(true);
    });

    it('rejeita CNPJ inválido', () => {
        expect(isCnpj('12345678000100')).toBe(false);
    });

    it('retorna false para null, undefined e string vazia', () => {
        expect(isCnpj(null)).toBe(false);
        expect(isCnpj(undefined)).toBe(false);
        expect(isCnpj('')).toBe(false);
    });

    it('aceita CNPJ como number', () => {
        expect(isCnpj(11222333000181)).toBe(true);
    });

    it('rejeita CNPJ com todos dígitos iguais', () => {
        expect(isCnpj('00000000000000')).toBe(false);
        expect(isCnpj('11111111111111')).toBe(false);
    });

    it('rejeita CNPJ de tamanhos errados', () => {
        expect(isCnpj('1122233300018')).toBe(false);
        expect(isCnpj('112223330001811')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isCnpj(ref('11222333000181'))).toBe(true);
    });
});

describe('isCpfCnpj e Aliases', () => {
    it('valida CPF via detecção automática', () => {
        expect(isCpfCnpj('52998224725')).toBe(true);
    });

    it('valida CNPJ via detecção automática', () => {
        expect(isCpfCnpj('11222333000181')).toBe(true);
    });

    it('retorna false para null e undefined', () => {
        expect(isCpfCnpj(null)).toBe(false);
        expect(isCpfCnpj(undefined)).toBe(false);
    });
});
