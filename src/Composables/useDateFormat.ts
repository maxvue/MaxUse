import { UseDateFormatReturn, useDateFormat as vueUseDateFormat } from '@vueuse/core';
import { MaybeRefOrGetter, toValue } from 'vue';

/**
 * Formats a date using a format pattern (VueUse wrapper with safe reactive fallback).
 * If the date is null or undefined, safely falls back to the current date.
 *
 * @param initialDate - The date to format (Date, timestamp, ISO string, or reactive ref/getter).
 * @param format - Formatting pattern (e.g., 'DD/MM/YYYY', 'HH:mm:ss', 'YYYY-MM-DD HH:mm').
 * @returns A reactive `UseDateFormatReturn` object containing the formatted string.
 *
 * @example
 * ```typescript
 * const formatted = useDateFormat('2026-05-24', 'DD/MM/YYYY');
 * // formatted.value → '24/05/2026'
 *
 * const withTime = useDateFormat(new Date(), 'DD/MM/YYYY HH:mm');
 * // withTime.value → '24/05/2026 14:30'
 * ```
 */
export const useDateFormat = (initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>, format: string): UseDateFormatReturn => {
    // O fallback para null/undefined preserva reatividade; entradas inválidas (NaN) não fabricam data plausível.
    return vueUseDateFormat(() => {
        const value = toValue(initialDate);
        if (value == null) return new Date();
        const d = value instanceof Date ? value : new Date(value);
        return isNaN(d.getTime()) ? (NaN as any) : (value as Date | number | string);
    }, format);
};

/** Alias for {@link useDateFormat}. */
export const dateFormat = useDateFormat;
