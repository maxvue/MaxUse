import { describe, it, expect } from 'vitest';
import { hasPassedDays } from './hasPassedDays';

describe('hasPassedDays', () => {
    it('retorna true para data antiga (dias suficientes passaram)', () => {
        const fiveDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        expect(hasPassedDays(fiveDaysAgo, 5)).toBe(true);
    });

    it('retorna false para data recente', () => {
        const now = new Date().toISOString();
        expect(hasPassedDays(now, 5)).toBe(false);
    });

    it('retorna true para null (sem data = sempre passou)', () => {
        expect(hasPassedDays(null)).toBe(true);
    });

    it('retorna true para data inválida', () => {
        expect(hasPassedDays('invalid')).toBe(true);
    });
});
