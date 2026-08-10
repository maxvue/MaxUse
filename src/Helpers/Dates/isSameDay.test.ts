import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isSameDay } from './isSameDay';

describe('isSameDay', () => {
    it('retorna true para mesmas datas (operador or)', () => {
        const d1 = '2026-06-15T10:00:00Z';
        const d2 = '2026-06-15T22:30:00Z';
        expect(isSameDay([d1, d2])).toBe(true);
    });

    it('retorna false para datas em dias diferentes (operador and com 2 datas únicas)', () => {
        expect(isSameDay(['2026-06-15', '2026-06-16'], 'and')).toBe(false);
    });

    it('retorna false para datas inválidas', () => {
        expect(isSameDay(['foo', 'bar'])).toBe(false);
        expect(isSameDay(['2026-06-15', 'invalid'])).toBe(false);
    });

    it('suporta formatos mistos date-only e ISO com hora no mesmo dia civil', () => {
        expect(isSameDay(['2024-01-01', '2024-01-01T10:00:00'])).toBe(true);
        expect(isSameDay([new Date('2024-01-01T10:00:00'), '2024-01-01'])).toBe(true);
    });

    it('retorna true para array com um único item válido', () => {
        expect(isSameDay(['2026-06-15'])).toBe(true);
        expect(isSameDay(['invalid-date'])).toBe(false);
    });

    it('retorna true para array vazio', () => {
        expect(isSameDay([])).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(isSameDay(ref(['2026-06-15T10:00:00Z', '2026-06-15T18:00:00Z']))).toBe(true);
    });
});
