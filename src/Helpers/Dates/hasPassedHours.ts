import { toValue, type MaybeRefOrGetter } from 'vue';

export type TPassedDate = string | number | Date | null | undefined;

/**
 * Verifica se um determinado número de horas se passou desde a data fornecida.
 * Nota: Se a data fornecida for nula, undefined ou inválida, considera que o prazo já passou (retorna true).
 *
 * @param dateValue A data inicial (aceita Date, timestamp, string ISO ou valores reativos).
 * @param hours Quantidade de horas (aceita valores reativos).
 * @returns Retorna true se o tempo já passou.
 */
export function hasPassedHours(
    dateValue: MaybeRefOrGetter<TPassedDate>,
    hours: MaybeRefOrGetter<number> = 1
): boolean {
    const rawValue: any = toValue(dateValue);
    const numHours = Number(toValue(hours));

    if (!rawValue) return true;

    const date = new Date(rawValue);
    if (isNaN(date.getTime())) return true;

    const limitHours = isNaN(numHours) ? 1 : numHours;
    const timeInMs: number = limitHours * 60 * 60 * 1000;
    const diferencaEmMs: number = Date.now() - date.getTime();
    return diferencaEmMs > timeInMs;
}
