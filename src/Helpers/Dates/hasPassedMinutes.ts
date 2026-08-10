import { toValue, type MaybeRefOrGetter } from 'vue';
import type { TPassedDate } from './hasPassedHours';

/**
 * Verifica se um determinado número de minutos se passou desde a data fornecida.
 * Nota: Se a data fornecida for nula, undefined ou inválida, considera que o prazo já passou (retorna true).
 *
 * @param dateValue A data inicial (aceita Date, timestamp, string ISO ou valores reativos).
 * @param minutes Quantidade de minutos (aceita valores reativos).
 * @returns Retorna true se o tempo já passou.
 */
export function hasPassedMinutes(
    dateValue: MaybeRefOrGetter<TPassedDate>,
    minutes: MaybeRefOrGetter<number> = 1
): boolean {
    const rawValue: any = toValue(dateValue);
    const numMinutes = Number(toValue(minutes));

    if (!rawValue) return true;

    const date = new Date(rawValue);
    if (isNaN(date.getTime())) return true;

    const limitMinutes = isNaN(numMinutes) ? 1 : numMinutes;
    const timeInMs: number = limitMinutes * 60 * 1000;
    const diferencaEmMs: number = Date.now() - date.getTime();
    return diferencaEmMs > timeInMs;
}
