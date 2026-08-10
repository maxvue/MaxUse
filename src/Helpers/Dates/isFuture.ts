import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type TDate = string | number | Date | null | undefined;

/**
 * Verifica se uma determinada data ainda está no futuro.
 *
 * @param dateValue A data a ser verificada.
 * @returns Retorna true se a data estiver no futuro.
 */
export function isFuture(dateValue: MaybeRefOrGetter<TDate>): boolean {
    const rawValue = toValue(dateValue);

    const date = _parseDate(rawValue);
    if (!date) return false;

    return date.getTime() > Date.now();
}

