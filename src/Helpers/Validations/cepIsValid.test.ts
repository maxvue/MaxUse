import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { cepIsValid } from './cepIsValid';

describe('cepIsValid', () => {
    it('valida CEP válido', () => {
        expect(cepIsValid('01001000')).toBe(true);
    });

    it('aceita CEP com hífen', () => {
        expect(cepIsValid('01001-000')).toBe(true);
    });

    it('rejeita CEP curto', () => {
        expect(cepIsValid('1234')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(cepIsValid(null)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(cepIsValid(ref('01001000'))).toBe(true);
    });
});
