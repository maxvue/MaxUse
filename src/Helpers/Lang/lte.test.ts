import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lte } from './lte';

describe('lte', () => {
    it('retorna true quando value é menor ou igual a other', () => {
        expect(lte(1, 3)).toBe(true);
        expect(lte(3, 3)).toBe(true);
        expect(lte(3, 1)).toBe(false);
    });

    it('compara strings lexicograficamente quando ambos são string (peculiaridade)', () => {
        expect(lte('a', 'b')).toBe(true);
        expect(lte('12', '3')).toBe(true);
    });

    it('converte para número quando nem todos os operandos são string', () => {
        expect(lte(3, '3')).toBe(true);
    });

    it('retorna false quando um operando não é comparável (NaN)', () => {
        expect(lte(3, NaN)).toBe(false);
        expect(lte(3, undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(lte(ref(3), ref(3))).toBe(true);
        expect(lte(ref(3), ref(1))).toBe(false);
    });
});
