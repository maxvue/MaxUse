import { describe, it, expect } from 'vitest';
import { hasPassedMinutes } from './hasPassedMinutes';

describe('hasPassedMinutes', () => {
    it('retorna true para data antiga (minutos suficientes passaram)', () => {
        const tenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        expect(hasPassedMinutes(tenMinAgo, 10)).toBe(true);
    });

    it('retorna false para data recente', () => {
        const now = new Date().toISOString();
        expect(hasPassedMinutes(now, 10)).toBe(false);
    });

    it('retorna true para null (sem data = sempre passou)', () => {
        expect(hasPassedMinutes(null)).toBe(true);
    });

    it('retorna true para data inválida', () => {
        expect(hasPassedMinutes('invalid')).toBe(true);
    });
});
