import { describe, it, expect } from 'vitest';
import { formatMailDate } from './formatMailDate';

describe('formatMailDate', () => {
    it('retorna vazio para null ou inválido', () => {
        expect(formatMailDate(null)).toBe('');
        expect(formatMailDate('invalid-date')).toBe('');
    });

    it('formata menos de 1h como "X min"', () => {
        const now = new Date();
        const date5min = new Date(now.getTime() - 5 * 60 * 1000);
        expect(formatMailDate(date5min)).toBe('5 min');

        const date1min = new Date(now.getTime() - 30 * 1000);
        expect(formatMailDate(date1min)).toBe('1 min');
    });

    it('formata hoje com mais de 1h como "HH:mm"', () => {
        const now = new Date();
        const date2h = new Date(now.getTime() - 2 * 3600 * 1000);
        // Garante que é no mesmo dia
        if (date2h.getDate() === now.getDate()) {
            const hh = String(date2h.getHours()).padStart(2, '0');
            const mm = String(date2h.getMinutes()).padStart(2, '0');
            expect(formatMailDate(date2h)).toBe(`${hh}:${mm}`);
        }
    });

    it('formata ontem como "Ontem HH:mm"', () => {
        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 22);
        expect(formatMailDate(yesterday)).toBe('Ontem 10:22');
    });

    it('formata menos de 1 semana como "X dias"', () => {
        const now = new Date();
        const date3days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 10, 0);
        expect(formatMailDate(date3days)).toBe('3 dias');
    });

    it('formata menos de 1 mês como "X Semanas"', () => {
        const now = new Date();
        const date14days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14, 10, 0);
        expect(formatMailDate(date14days)).toBe('2 Semanas');

        const date7days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 10, 0);
        expect(formatMailDate(date7days)).toBe('1 Semana');
    });

    it('formata menos de 1 ano como "X Mêses"', () => {
        const now = new Date();
        const date60days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60, 10, 0);
        expect(formatMailDate(date60days)).toBe('2 Mêses');
    });

    it('formata mais de 1 ano como "X Anos"', () => {
        const now = new Date();
        const date2years = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate(), 10, 0);
        expect(formatMailDate(date2years)).toBe('2 Anos');
    });
});
