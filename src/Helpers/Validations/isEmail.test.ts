import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isEmail } from './isEmail';

describe('isEmail', () => {
    it('valida email correto', () => {
        expect(isEmail('user@example.com')).toBe(true);
    });

    it('valida email com subdomínio', () => {
        expect(isEmail('user@mail.example.com')).toBe(true);
    });

    it('rejeita sem @', () => {
        expect(isEmail('userexample.com')).toBe(false);
    });

    it('rejeita sem domínio', () => {
        expect(isEmail('user@')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isEmail(null)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isEmail(ref('test@test.com'))).toBe(true);
    });
});

describe('isEmail — regressão auditoria (achado 025)', () => {
    it.each([
        'a@b..com',
        'a@-dominio.com',
        'a@dominio-.com',
        'a@.com',
        'a..b@dominio.com',
        '.a@dominio.com'
    ])('rejeita %s', (invalido) => {
        expect(isEmail(invalido)).toBe(false);
    });

    it.each([
        'nome@dominio.com',
        'nome.sobrenome+tag@sub.dominio.com.br',
        'a@b.co',
        'usuario_1@empresa-x.com.br'
    ])('aceita %s', (valido) => {
        expect(isEmail(valido)).toBe(true);
    });
});
