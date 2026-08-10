import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { formatCep, formatCpf, formatCnpj, formatCpfCnpj, formatPhone, maskSensitive } from './masks';

describe('formatCep', () => {
    it('formata CEP com 8 dígitos', () => {
        expect(formatCep('12345678')).toBe('12345-678');
    });

    it('formata CEP numérico com zero à esquerda', () => {
        expect(formatCep(1001000)).toBe('01001-000');
    });

    it('é consistente com cepIsValid para entrada numérica', () => {
        expect(formatCep(1001000)).toMatch(/^\d{5}-\d{3}$/);
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
        expect(formatCpf('12345678901')).toBe('123.456.789-01');
    });

    it('retorna string original para CPF com menos de 11 dígitos', () => {
        expect(formatCpf('123')).toBe('123');
    });

    it('retorna vazio para null', () => {
        expect(formatCpf(null)).toBe('');
    });

    it('funciona com Ref', () => {
        expect(formatCpf(ref('12345678901'))).toBe('123.456.789-01');
    });
});

describe('formatCnpj', () => {
    it('formata CNPJ com 14 dígitos', () => {
        expect(formatCnpj('12345678000199')).toBe('12.345.678/0001-99');
    });

    it('retorna vazio para null', () => {
        expect(formatCnpj(null)).toBe('');
    });
});

describe('formatCpfCnpj', () => {
    it('formata CPF quando tem 11 dígitos', () => {
        expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01');
    });

    it('formata CNPJ quando tem 14 dígitos', () => {
        expect(formatCpfCnpj('12345678000199')).toBe('12.345.678/0001-99');
    });

    it('retorna string original para documento com 12 dígitos sem perder caractere', () => {
        expect(formatCpfCnpj('123456789012')).toBe('123456789012');
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

    it('não formata DDDs inexistentes', () => {
        expect(formatPhone('0301234567')).toBe('0301234567');
        expect(formatPhone('2012345678')).toBe('2012345678');
        expect(formatPhone('0012345678')).toBe('0012345678');
    });

    it('trata 0300 como número não-geográfico', () => {
        expect(formatPhone('03001234567')).not.toBe('(03) 00123-4567');
    });

    it('retorna vazio para null', () => {
        expect(formatPhone(null)).toBe('');
    });

    it('retorna string original para tamanho de telefone inválido', () => {
        expect(formatPhone('1234')).toBe('1234');
    });

    it('retorna string original para 12 dígitos que não começam com 55', () => {
        expect(formatPhone('119999912345')).toBe('119999912345');
    });

    it('retorna string original para 0800 com comprimento diferente de 11', () => {
        expect(formatPhone('080012345')).toBe('080012345');
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

    it('mascara integralmente string sem @ no modo email (não vaza o valor)', () => {
        const result = maskSensitive('noatsign', 'email');
        expect(result).toBe('****');
        expect(result).not.toContain('noatsign');
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

describe('maskSensitive — regressão auditoria (achado 017)', () => {
    it('não expõe cartões curtos por inteiro', () => {
        expect(maskSensitive('12', 'card')).not.toContain('12');
        expect(maskSensitive('123', 'card')).toBe('**** **** **** ****');
    });

    it('continua revelando os 4 últimos dígitos de cartões completos', () => {
        expect(maskSensitive('4111111111111234', 'card')).toBe('**** **** **** 1234');
    });

    it('não expõe domínios de e-mail curtos por inteiro', () => {
        expect(maskSensitive('ab@x.com', 'email')).not.toBe('a***@x***.com');
    });

    it('nunca revela mais de 1/3 do valor no modo text', () => {
        const cpf = '12345678901';
        const masked = maskSensitive(cpf);
        const revealed = [...masked].filter((c) => c !== '*').length;
        expect(revealed).toBeLessThanOrEqual(Math.ceil(cpf.length / 3));
    });

    it('mascara integralmente valores curtos no modo text', () => {
        expect(maskSensitive('abcdef')).toBe('****');
    });
});
