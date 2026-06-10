import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { phone } from './phone';

describe('phone', () => {
    it('valida celular BR', () => {
        expect(phone('+5511999991234')).toBe(true);
    });

    it('valida fixo BR', () => {
        expect(phone('+551133334444')).toBe(true);
    });

    it('rejeita número inválido', () => {
        expect(phone('123')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(phone(null)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(phone(ref('+5511999991234'))).toBe(true);
    });
});
