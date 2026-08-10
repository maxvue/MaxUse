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

    it('trata overflow de fim de mês e ano bissexto no último dia útil', () => {
        // 31/01/2024 + 1 mês = 29/02/2024 (ano bissexto)
        const jan31_2024 = addTime('2024-01-31', 1, 'month');
        expect(jan31_2024?.getDate()).toBe(29);
        expect(jan31_2024?.getMonth()).toBe(1); // Fev

        // 31/01/2023 + 1 mês = 28/02/2023 (ano normal)
        const jan31_2023 = addTime('2023-01-31', 1, 'month');
        expect(jan31_2023?.getDate()).toBe(28);
        expect(jan31_2023?.getMonth()).toBe(1); // Fev

        // 29/02/2024 + 1 ano = 28/02/2025
        const feb29_2024 = addTime('2024-02-29', 1, 'year');
        expect(feb29_2024?.getDate()).toBe(28);
        expect(feb29_2024?.getMonth()).toBe(1); // Fev
        expect(feb29_2024?.getFullYear()).toBe(2025);
    });

    it('retorna null para amount NaN ou não finito', () => {
        expect(addTime(base, NaN)).toBeNull();
        expect(addTime(base, Infinity)).toBeNull();
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

    it('retorna null para unidade não mapeada', () => {
        const result = addTime(base, 1, 'decada' as any);
        expect(result).toBeNull();
    });
});
