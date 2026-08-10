import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type TDate = string | number | Date | null | undefined;
type IDateInterval = { start: Date | string | number; end?: Date | string | number | null };

/**
 * Verifica se uma data está dentro de um intervalo.
 *
 * @param value A data a ser verificada.
 * @param interval O intervalo (início e fim).
 * @returns Retorna true se estiver no intervalo.
 */
export function inDateInterval(value: MaybeRefOrGetter<TDate>, interval: MaybeRefOrGetter<IDateInterval>): boolean {
    const targetValue = toValue(value);
    const rawInterval = toValue(interval);

    if (!targetValue || !rawInterval) return false;

    const targetDate = _parseDate(targetValue);
    const startDate = _parseDate(rawInterval.start);

    if (!targetDate || !startDate) return false;

    let endDate: Date | null = null;
    if (rawInterval.end !== undefined && rawInterval.end !== null) {
        endDate = _parseDate(rawInterval.end);
        if (!endDate) return false;
    }

    const targetTs = targetDate.getTime();
    const startTs = startDate.getTime();
    const endTs = endDate !== null ? endDate.getTime() : null;

    return targetTs >= startTs && (endTs === null || targetTs <= endTs);
}

/**
 * Alias para inDateInterval. Verifica se uma data está dentro de um intervalo.
 *
 * @param value A data a ser verificada.
 * @param interval O intervalo (início e fim).
 * @returns Retorna true se estiver no intervalo.
 */
export function isInDateInterval(value: MaybeRefOrGetter<TDate>, interval: MaybeRefOrGetter<IDateInterval>): boolean {
    return inDateInterval(value, interval);
}

