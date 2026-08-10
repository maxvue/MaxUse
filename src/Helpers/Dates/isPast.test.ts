import { describe, it, expect, vi } from 'vitest';
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

    it('trata data-only YYYY-MM-DD no fuso local, não em UTC', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T02:00:00Z')); // 23h de 14/01/2024 em GMT-3
        expect(isPast('2024-01-15')).toBe(false);
        vi.useRealTimers();
    });

    it('trata epoch 0 (1970) como data no passado', () => {
        expect(isPast(0)).toBe(true);
    });
});
