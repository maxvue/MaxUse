import { describe, it, expect } from 'vitest';
import { secondsAgo, minutesAgo, hoursAgo, daysAgo, monthsAgo, yearsAgo } from './timeAgo';

describe('secondsAgo', () => {
    it('retorna segundos positivos para data no passado', () => {
        const tenSecsAgo = new Date(Date.now() - 10000).toISOString();
        expect(secondsAgo(tenSecsAgo)).toBeGreaterThanOrEqual(9);
    });

    it('retorna 0 para datas no futuro', () => {
        const futureDate = new Date(Date.now() + 100000).toISOString();
        expect(secondsAgo(futureDate)).toBe(0);
    });

    it('retorna 0 para null', () => {
        expect(secondsAgo(null)).toBe(0);
    });

    it('retorna 0 para undefined', () => {
        expect(secondsAgo(undefined)).toBe(0);
    });
});

describe('minutesAgo', () => {
    it('retorna minutos para data no passado', () => {
        const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        expect(minutesAgo(thirtyMinAgo)).toBeGreaterThanOrEqual(29);
    });

    it('retorna 0 para null', () => {
        expect(minutesAgo(null)).toBe(0);
    });
});

describe('hoursAgo', () => {
    it('retorna horas para data no passado', () => {
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
        expect(hoursAgo(threeHoursAgo)).toBeGreaterThanOrEqual(2);
    });

    it('retorna 0 para null', () => {
        expect(hoursAgo(null)).toBe(0);
    });
});

describe('daysAgo', () => {
    it('retorna dias para data no passado', () => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        expect(daysAgo(twoDaysAgo)).toBeGreaterThanOrEqual(1);
    });

    it('retorna 0 para null', () => {
        expect(daysAgo(null)).toBe(0);
    });
});

describe('monthsAgo', () => {
    it('retorna meses para data no passado', () => {
        const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
        expect(monthsAgo(threeMonthsAgo)).toBeGreaterThanOrEqual(2);
    });

    it('retorna 0 para null', () => {
        expect(monthsAgo(null)).toBe(0);
    });
});

describe('yearsAgo', () => {
    it('retorna anos para data no passado', () => {
        const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
        expect(yearsAgo(twoYearsAgo)).toBeGreaterThanOrEqual(1);
    });

    it('retorna 0 para null', () => {
        expect(yearsAgo(null)).toBe(0);
    });
});
