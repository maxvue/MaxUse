import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type TDate = string | number | Date | null | undefined;
type TUnit = 'day' | 'days' | 'month' | 'months' | 'year' | 'years' | 'hour' | 'hours' | 'minute' | 'minutes' | 'second' | 'seconds';

/**
 * Adiciona ou subtrai uma quantidade específica de tempo a uma data.
 *
 * @param dateValue A data base.
 * @param amount A quantidade de tempo a adicionar (ou subtrair se negativo).
 * @param unit A unidade de tempo.
 * @returns Retorna o objeto Date resultante ou null se inválido.
 */
export function addTime(
    dateValue: MaybeRefOrGetter<TDate>,
    amount: MaybeRefOrGetter<number>,
    unit: MaybeRefOrGetter<TUnit> = 'days'
): Date | null {
    const rawDate = toValue(dateValue);
    const rawAmount = toValue(amount);
    const rawUnit = toValue(unit)?.toLowerCase() as TUnit;

    if (!Number.isFinite(rawAmount)) return null;

    const date = _parseDate(rawDate);
    if (!date) return null;

    let expectedDay: number;

    switch (rawUnit) {
        case 'day':
        case 'days':
            date.setDate(date.getDate() + rawAmount);
            break;
        case 'month':
        case 'months':
            expectedDay = date.getDate();
            date.setMonth(date.getMonth() + rawAmount);
            if (date.getDate() !== expectedDay) date.setDate(0);

            break;
        case 'year':
        case 'years':
            expectedDay = date.getDate();
            date.setFullYear(date.getFullYear() + rawAmount);
            if (date.getDate() !== expectedDay) date.setDate(0);

            break;
        case 'hour':
        case 'hours':
            date.setHours(date.getHours() + rawAmount);
            break;
        case 'minute':
        case 'minutes':
            date.setMinutes(date.getMinutes() + rawAmount);
            break;
        case 'second':
        case 'seconds':
            date.setSeconds(date.getSeconds() + rawAmount);
            break;
        default:
            return null;
    }

    return date;
}

