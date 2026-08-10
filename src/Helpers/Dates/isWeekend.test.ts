import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isWeekend } from './isWeekend';

describe('isWeekend', () => {
    // 2026-06-13 é sábado, 2026-06-14 é domingo, 2026-06-15 é segunda
    it('retorna true para sábado', () => {
        expect(isWeekend('2026-06-13T12:00:00Z')).toBe(true);
        expect(isWeekend('2026-06-13')).toBe(true); // Sábado date-only em fuso local
    });

    it('retorna true para domingo', () => {
        expect(isWeekend('2026-06-14T12:00:00Z')).toBe(true);
        expect(isWeekend('2026-06-14')).toBe(true); // Domingo date-only em fuso local
    });

    it('retorna false para dia útil (segunda)', () => {
        expect(isWeekend('2026-06-15T12:00:00Z')).toBe(false);
        expect(isWeekend('2026-06-15')).toBe(false); // Segunda date-only em fuso local
    });

    it('retorna false para null', () => {
        expect(isWeekend(null)).toBe(false);
    });

    it('retorna false para data inválida', () => {
        expect(isWeekend('not-a-date')).toBe(false);
    });

    it('funciona com Ref', () => {
        expect(isWeekend(ref('2026-06-13T12:00:00Z'))).toBe(true);
        expect(isWeekend(ref('2026-06-13'))).toBe(true);
    });
});
