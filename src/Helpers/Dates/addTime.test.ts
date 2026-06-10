import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { addTime } from './addTime';

describe('addTime', () => {
    const base = '2026-06-15T12:00:00Z';

    it('adiciona dias', () => {
        const result = addTime(base, 5, 'days');
        expect(result?.getDate()).toBe(new Date(base).getDate() + 5);
    });

    it('subtrai dias (valor negativo)', () => {
        const result = addTime(base, -3, 'days');
        expect(result?.getDate()).toBe(new Date(base).getDate() - 3);
    });

    it('usa a unidade "days" como fallback padrão', () => {
        const result = addTime(base, 4);
        expect(result?.getDate()).toBe(new Date(base).getDate() + 4);
    });

    it('adiciona meses', () => {
        const result = addTime(base, 2, 'months');
        expect(result?.getMonth()).toBe(new Date(base).getMonth() + 2);
    });

    it('adiciona anos', () => {
        const result = addTime(base, 1, 'years');
        expect(result?.getFullYear()).toBe(new Date(base).getFullYear() + 1);
    });

    it('adiciona horas', () => {
        const result = addTime(base, 3, 'hours');
        expect(result?.getHours()).toBe(new Date(base).getHours() + 3);
    });

    it('adiciona minutos', () => {
        const result = addTime(base, 30, 'minutes');
        expect(result?.getMinutes()).toBe(new Date(base).getMinutes() + 30);
    });

    it('adiciona segundos', () => {
        const result = addTime(base, 45, 'seconds');
        expect(result?.getSeconds()).toBe(new Date(base).getSeconds() + 45);
    });

    it('aceita unidades no singular (day, month, year, hour, minute, second)', () => {
        expect(addTime(base, 1, 'day')?.getDate()).toBe(new Date(base).getDate() + 1);
        expect(addTime(base, 1, 'month')?.getMonth()).toBe(new Date(base).getMonth() + 1);
        expect(addTime(base, 1, 'year')?.getFullYear()).toBe(new Date(base).getFullYear() + 1);
        expect(addTime(base, 1, 'hour')?.getHours()).toBe(new Date(base).getHours() + 1);
        expect(addTime(base, 1, 'minute')?.getMinutes()).toBe(new Date(base).getMinutes() + 1);
        expect(addTime(base, 1, 'second')?.getSeconds()).toBe(new Date(base).getSeconds() + 1);
    });

    it('retorna null para data inválida', () => {
        expect(addTime('invalid', 1)).toBeNull();
    });

    it('retorna null para null', () => {
        expect(addTime(null, 1)).toBeNull();
    });

    it('retorna null para undefined', () => {
        expect(addTime(undefined, 1)).toBeNull();
    });

    // Reatividade
    it('funciona com Ref', () => {
        const result = addTime(ref(base), ref(1), ref('days'));
        expect(result).not.toBeNull();
    });

    it('retorna a mesma data para unidade não mapeada', () => {
        const result = addTime(base, 1, 'decada' as any);
        expect(result?.getTime()).toBe(new Date(base).getTime());
    });
});
