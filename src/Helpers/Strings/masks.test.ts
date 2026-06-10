import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { formatCep, formatCpf, formatCnpj, formatCpfCnpj, formatPhone, maskSensitive } from './masks';

describe('formatCep', () => {
    it('formata CEP com 8 dígitos', () => {
        expect(formatCep('12345678')).toBe('12345-678');
    });

    it('retorna string original se não tem 8 dígitos', () => {
        expect(formatCep('1234')).toBe('1234');
    });

    it('retorna vazio para null', () => {
        expect(formatCep(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(formatCep(ref('01001000'))).toBe('01001-000');
    });
});

describe('formatCpf', () => {
    it('formata CPF com 11 dígitos', () => {
        const result = formatCpf('12345678901');
        expect(result).toContain('.');
        expect(result).toContain('-');
    });

    it('retorna vazio para null', () => {
        expect(formatCpf(null)).toBe('');
    });

    it('funciona com Ref', () => {
        const result = formatCpf(ref('12345678901'));
        expect(result.length).toBeGreaterThan(0);
    });
});

describe('formatCnpj', () => {
    it('formata CNPJ com 14 dígitos', () => {
        const result = formatCnpj('12345678000199');
        expect(result).toContain('.');
        expect(result).toContain('/');
        expect(result).toContain('-');
    });

    it('retorna vazio para null', () => {
        expect(formatCnpj(null)).toBe('');
    });
});

describe('formatCpfCnpj', () => {
    it('formata CPF quando tem 11 dígitos', () => {
        const result = formatCpfCnpj('12345678901');
        expect(result).toContain('.');
        expect(result).toContain('-');
    });

    it('formata CNPJ quando tem 14 dígitos', () => {
        const result = formatCpfCnpj('12345678000199');
        expect(result).toContain('/');
    });

    it('retorna vazio para null', () => {
        expect(formatCpfCnpj(null)).toBe('');
    });
});

describe('formatPhone', () => {
    it('formata telefone fixo (10 dígitos)', () => {
        expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('formata celular (11 dígitos)', () => {
        expect(formatPhone('11999991234')).toBe('(11) 99999-1234');
    });

    it('formata com DDI 55 (13 dígitos)', () => {
        expect(formatPhone('5511999991234')).toBe('(11) 99999-1234');
    });

    it('formata com DDI 55 fixo (12 dígitos)', () => {
        expect(formatPhone('551133334444')).toBe('(11) 3333-4444');
    });

    it('formata 0800', () => {
        expect(formatPhone('08001234567')).toBe('0800 123 4567');
    });

    it('retorna vazio para null', () => {
        expect(formatPhone(null)).toBe('');
    });

    it('retorna string original para tamanho de telefone inválido', () => {
        expect(formatPhone('1234')).toBe('1234');
    });

    it('funciona com Ref', () => {
        expect(formatPhone(ref('11999991234'))).toBe('(11) 99999-1234');
    });
});

describe('maskSensitive', () => {
    it('mascara email mostrando primeiros 3 caracteres', () => {
        const result = maskSensitive('joao.silva@gmail.com', 'email');
        expect(result).toContain('***');
        expect(result).toContain('@');
    });

    it('mascara email com user curto (≤3 chars)', () => {
        const result = maskSensitive('ab@gmail.com', 'email');
        expect(result).toContain('***');
        expect(result).toContain('@');
    });

    it('mascara email sem sufixo de domínio', () => {
        const result = maskSensitive('user@localhost', 'email');
        expect(result).toContain('@');
    });

    it('mascara string sem @ como email (retorna original)', () => {
        const result = maskSensitive('noatsign', 'email');
        expect(result).toBe('noatsign');
    });

    it('mascara cartão mostrando últimos 4 dígitos', () => {
        const result = maskSensitive('4111111111111111', 'card');
        expect(result).toBe('**** **** **** 1111');
    });

    it('mascara texto genérico', () => {
        const result = maskSensitive('Dados Sensíveis', 'text');
        expect(result.startsWith('Da')).toBe(true);
        expect(result.endsWith('is')).toBe(true);
        expect(result).toContain('***');
    });

    it('retorna **** para texto curto (≤4 chars)', () => {
        expect(maskSensitive('abc', 'text')).toBe('****');
    });

    it('retorna vazio para null', () => {
        expect(maskSensitive(null)).toBe('');
    });

    it('funciona com Ref', () => {
        const result = maskSensitive(ref('4111111111111111'), 'card');
        expect(result).toBe('**** **** **** 1111');
    });
});
