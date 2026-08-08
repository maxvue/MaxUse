import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lt } from './lt';

describe('lt', () => {
    it('retorna true quando value é menor que other', () => {
        expect(lt(1, 3)).toBe(true);
        expect(lt(3, 3)).toBe(false);
    });

    it('compara strings lexicograficamente quando ambos são string (peculiaridade)', () => {
        expect(lt('a', 'b')).toBe(true);
        expect(lt('12', '3')).toBe(true);
    });

    it('converte para número quando nem todos os operandos são string', () => {
        expect(lt('12', 3)).toBe(false);
    });

    it('retorna false quando um operando não é comparável (NaN)', () => {
        expect(lt(3, NaN)).toBe(false);
        expect(lt(3, undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(lt(ref(1), ref(3))).toBe(true);
        expect(lt(ref(3), ref(1))).toBe(false);
    });
});
