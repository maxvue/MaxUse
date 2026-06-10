import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { effectScope } from 'vue';
import { useDateFormat } from './useDateFormat';

describe('useDateFormat', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
    });

    it('formata data no padrão DD/MM/YYYY', () => {
        scope.run(() => {
            const result = useDateFormat('2026-06-15T12:00:00Z', 'DD/MM/YYYY');
            expect(result.value).toBe('15/06/2026');
        });
    });

    it('formata data com hora', () => {
        scope.run(() => {
            const result = useDateFormat('2026-06-15T14:30:00Z', 'YYYY-MM-DD HH:mm');
            expect(result.value).toContain('2026-06-15');
        });
    });

    it('usa data atual como fallback para null', () => {
        scope.run(() => {
            const result = useDateFormat(null, 'DD/MM/YYYY');
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            // Deve conter o dia de hoje
            expect(result.value).toContain(day);
        });
    });

    it('usa data atual como fallback para undefined', () => {
        scope.run(() => {
            const result = useDateFormat(undefined, 'YYYY');
            const year = new Date().getFullYear().toString();
            expect(result.value).toContain(year);
        });
    });

    it('aceita instância de Date', () => {
        scope.run(() => {
            // Usando hora 12:00 UTC para evitar mudança de dia no fuso local
            const result = useDateFormat(new Date('2026-01-15T12:00:00Z'), 'YYYY');
            expect(result.value).toContain('2026');
        });
    });
});
