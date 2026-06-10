import { describe, it, expect } from 'vitest';
import { hasPassedHours } from './hasPassedHours';

describe('hasPassedHours', () => {
    it('retorna true para data antiga (horas suficientes passaram)', () => {
        const twoHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
        expect(hasPassedHours(twoHoursAgo, 2)).toBe(true);
    });

    it('retorna false para data recente', () => {
        const now = new Date().toISOString();
        expect(hasPassedHours(now, 2)).toBe(false);
    });

    it('retorna true para null (sem data = sempre passou)', () => {
        expect(hasPassedHours(null)).toBe(true);
    });

    it('retorna true para data inválida', () => {
        expect(hasPassedHours('invalid')).toBe(true);
    });
});
