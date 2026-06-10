import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isFuture } from './isFuture';

describe('isFuture', () => {
    it('retorna true para data no futuro', () => {
        expect(isFuture('2099-12-31')).toBe(true);
    });

    it('retorna false para data no passado', () => {
        expect(isFuture('2020-01-01')).toBe(false);
    });

    it('retorna false para null', () => {
        expect(isFuture(null)).toBe(false);
    });

    it('retorna false para data inválida (NaN)', () => {
        expect(isFuture('not-a-date')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isFuture(ref('2099-01-01'))).toBe(true);
    });
});
