import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { gt } from './gt';

describe('gt', () => {
    it('retorna true quando value é maior que other', () => {
        expect(gt(3, 1)).toBe(true);
        expect(gt(3, 3)).toBe(false);
    });

    it('compara strings lexicograficamente quando ambos são string (peculiaridade)', () => {
        expect(gt('b', 'a')).toBe(true);
        expect(gt('3', '12')).toBe(true);
    });

    it('converte para número quando nem todos os operandos são string', () => {
        expect(gt(3, '12')).toBe(false);
        expect(gt(3, null)).toBe(true);
    });

    it('retorna false quando um operando não é comparável (NaN)', () => {
        expect(gt(3, NaN)).toBe(false);
        expect(gt(3, undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(gt(ref(3), ref(1))).toBe(true);
        expect(gt(ref(1), ref(3))).toBe(false);
    });
});
