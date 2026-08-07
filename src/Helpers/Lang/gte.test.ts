import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { gte } from './gte';

describe('gte', () => {
    it('retorna true quando value é maior ou igual a other', () => {
        expect(gte(3, 1)).toBe(true);
        expect(gte(3, 3)).toBe(true);
        expect(gte(1, 3)).toBe(false);
    });

    it('compara strings lexicograficamente quando ambos são string (peculiaridade)', () => {
        expect(gte('b', 'a')).toBe(true);
        expect(gte('3', '12')).toBe(true);
    });

    it('converte para número quando nem todos os operandos são string', () => {
        expect(gte(3, '3')).toBe(true);
    });

    it('retorna false quando um operando não é comparável (NaN)', () => {
        expect(gte(3, NaN)).toBe(false);
        expect(gte(3, undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(gte(ref(3), ref(3))).toBe(true);
        expect(gte(ref(1), ref(3))).toBe(false);
    });
});
