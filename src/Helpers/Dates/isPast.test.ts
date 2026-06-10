import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isPast } from './isPast';

describe('isPast', () => {
    it('retorna true para data no passado', () => {
        expect(isPast('2020-01-01')).toBe(true);
    });

    it('retorna false para data no futuro', () => {
        expect(isPast('2099-12-31')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isPast(null)).toBe(false);
    });

    it('retorna false para data inválida', () => {
        expect(isPast('invalid')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isPast(ref('2020-01-01'))).toBe(true);
    });
});
