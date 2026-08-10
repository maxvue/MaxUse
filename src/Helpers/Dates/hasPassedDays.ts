import { toValue, type MaybeRefOrGetter } from 'vue';
import type { TPassedDate } from './hasPassedHours';

/**
 * Verifica se um determinado número de dias se passou desde a data fornecida.
 * Nota: Se a data fornecida for nula, undefined ou inválida, considera que o prazo já passou (retorna true).
 *
 * @param dateValue A data inicial (aceita Date, timestamp, string ISO ou valores reativos).
 * @param days Quantidade de dias (aceita valores reativos).
 * @returns Retorna true se o tempo já passou.
 */
export function hasPassedDays(
    dateValue: MaybeRefOrGetter<TPassedDate>,
    days: MaybeRefOrGetter<number> = 1
): boolean {
    const rawValue: any = toValue(dateValue);
    const numDays = Number(toValue(days));

    if (!rawValue) return true;

    const date = new Date(rawValue);
    if (isNaN(date.getTime())) return true;

    const limitDays = isNaN(numDays) ? 1 : numDays;
    const timeInMs: number = limitDays * 24 * 60 * 60 * 1000;
    const diferencaEmMs: number = Date.now() - date.getTime();
    return diferencaEmMs > timeInMs;
}
