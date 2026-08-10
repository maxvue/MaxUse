import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isDate } from './isDate';

describe('isDate', () => {
    it('valida instância de Date', () => {
        expect(isDate(new Date() as any)).toBe(true);
    });

    it('valida string ISO', () => {
        expect(isDate('2026-01-15')).toBe(true);
    });

    it('valida formato brasileiro (DD/MM/YYYY)', () => {
        expect(isDate('28/12/2024')).toBe(true);
        expect(isDate('28/12/2024 14:30:00')).toBe(true);
    });

    it('rejeita formato brasileiro com dia/mês inválido', () => {
        expect(isDate('31/02/2024')).toBe(false);
        expect(isDate('99/99/2024')).toBe(false);
    });

    it('valida timestamp numérico', () => {
        expect(isDate(Date.now())).toBe(true);
    });

    it('rejeita string inválida', () => {
        expect(isDate('not-a-date')).toBe(false);
    });

    it('rejeita null', () => {
        expect(isDate(null)).toBe(false);
    });

    it('rejeita undefined', () => {
        expect(isDate(undefined)).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isDate(ref('2026-06-15'))).toBe(true);
        expect(isDate(ref('invalid'))).toBe(false);
    });
});
