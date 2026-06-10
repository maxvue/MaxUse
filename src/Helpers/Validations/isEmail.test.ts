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
