import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { secondsAgo, minutesAgo, hoursAgo, daysAgo, monthsAgo, yearsAgo } from './timeAgo';

describe('timeAgo helpers', () => {
    // Congela o tempo em 2024-06-15 12:00:00 UTC (09:00:00 GMT-3)
    const baseDateString = '2024-06-15T12:00:00Z';
    const baseTimestamp = new Date(baseDateString).getTime();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(baseDateString));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('secondsAgo', () => {
        it('retorna segundos exatos para data no passado', () => {
            const tenSecsAgo = new Date(baseTimestamp - 10_000);
            expect(secondsAgo(tenSecsAgo)).toBe(10);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date(baseTimestamp + 10_000);
            expect(secondsAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null, undefined e invalido', () => {
            expect(secondsAgo(null)).toBe(0);
            expect(secondsAgo(undefined)).toBe(0);
            expect(secondsAgo('invalid-date')).toBe(0);
        });

        it('calcula segundos para epoch 0', () => {
            expect(secondsAgo(0)).toBe(Math.floor(baseTimestamp / 1000));
        });

        it('trata string YYYY-MM-DD em horario local', () => {
            // Em GMT-3, 2024-06-15 00:00:00 local e 2024-06-15 09:00:00 local da 9h (32400 s)
            expect(secondsAgo('2024-06-15')).toBe(9 * 3600);
        });
    });

    describe('minutesAgo', () => {
        it('retorna minutos exatos para data no passado', () => {
            const thirtyMinAgo = new Date(baseTimestamp - 30 * 60 * 1000);
            expect(minutesAgo(thirtyMinAgo)).toBe(30);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date(baseTimestamp + 5 * 60 * 1000);
            expect(minutesAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null e invalid', () => {
            expect(minutesAgo(null)).toBe(0);
            expect(minutesAgo('invalid')).toBe(0);
        });
    });

    describe('hoursAgo', () => {
        it('retorna horas exatas para data no passado', () => {
            const threeHoursAgo = new Date(baseTimestamp - 3 * 60 * 60 * 1000);
            expect(hoursAgo(threeHoursAgo)).toBe(3);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date(baseTimestamp + 60 * 60 * 1000);
            expect(hoursAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null', () => {
            expect(hoursAgo(null)).toBe(0);
        });
    });

    describe('daysAgo', () => {
        it('retorna dias exatos para data no passado', () => {
            const twoDaysAgo = new Date(baseTimestamp - 2 * 24 * 60 * 60 * 1000);
            expect(daysAgo(twoDaysAgo)).toBe(2);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date(baseTimestamp + 24 * 60 * 60 * 1000);
            expect(daysAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null', () => {
            expect(daysAgo(null)).toBe(0);
        });
    });

    describe('monthsAgo', () => {
        it('retorna meses exatos para data no passado', () => {
            const threeMonthsAgo = new Date('2024-03-15T12:00:00Z');
            expect(monthsAgo(threeMonthsAgo)).toBe(3);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date('2024-07-15T12:00:00Z');
            expect(monthsAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null e invalid', () => {
            expect(monthsAgo(null)).toBe(0);
            expect(monthsAgo('invalid')).toBe(0);
        });
    });

    describe('yearsAgo', () => {
        it('retorna anos exatos para data no passado', () => {
            const twoYearsAgo = new Date('2022-06-15T12:00:00Z');
            expect(yearsAgo(twoYearsAgo)).toBe(2);
        });

        it('retorna 0 para datas no futuro', () => {
            const futureDate = new Date('2025-06-15T12:00:00Z');
            expect(yearsAgo(futureDate)).toBe(0);
        });

        it('retorna 0 para null e invalid', () => {
            expect(yearsAgo(null)).toBe(0);
            expect(yearsAgo('invalid')).toBe(0);
        });
    });
});
