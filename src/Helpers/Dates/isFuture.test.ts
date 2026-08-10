import { describe, it, expect, vi } from 'vitest';
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

    it('trata data-only YYYY-MM-DD no fuso local, não em UTC', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T02:00:00Z')); // 23h de 14/01/2024 em GMT-3
        expect(isFuture('2024-01-15')).toBe(true);
        vi.useRealTimers();
    });

    it('retorna false para epoch 0', () => {
        expect(isFuture(0)).toBe(false);
    });
});
