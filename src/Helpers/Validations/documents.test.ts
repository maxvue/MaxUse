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

    it('funciona com Ref', () => {
        expect(isCpf(ref('52998224725'))).toBe(true);
    });
});

describe('isCnpj', () => {
    it('valida CNPJ válido', () => {
        expect(isCnpj('11222333000181')).toBe(true);
    });

    it('rejeita CNPJ inválido', () => {
        expect(isCnpj('12345678000100')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isCnpj(ref('11222333000181'))).toBe(true);
    });
});

describe('isCpfCnpj', () => {
    it('valida CPF via detecção automática', () => {
        expect(isCpfCnpj('52998224725')).toBe(true);
    });

    it('valida CNPJ via detecção automática', () => {
        expect(isCpfCnpj('11222333000181')).toBe(true);
    });
});
