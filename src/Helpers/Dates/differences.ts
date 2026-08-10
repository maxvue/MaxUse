import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

function parseDate(value: RefDate): Date | null {
    const data = toValue(value);
    return _parseDate(data);
}

/**
 * Calcula a diferença absoluta em segundos entre duas datas.
 */
export function diffInSeconds(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;
    return Math.abs(Math.floor((d1.getTime() - d2.getTime()) / 1000));
}

/**
 * Calcula a diferença absoluta em minutos entre duas datas.
 */
export function diffInMinutes(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInSeconds(date1, date2) / 60));
}

/**
 * Calcula a diferença absoluta em horas entre duas datas.
 */
export function diffInHours(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInMinutes(date1, date2) / 60));
}

/**
 * Calcula a diferença absoluta em dias entre duas datas.
 */
export function diffInDays(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInHours(date1, date2) / 24));
}

/**
 * Calcula a diferença absoluta em meses COMPLETOS entre duas datas.
 * O dia é considerado: 31/01 → 01/02 retorna 0, pois não completou um mês.
 */
export function diffInMonths(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;

    const [earlier, later] = d1 <= d2 ? [d1, d2] : [d2, d1];

    let months = (later.getFullYear() - earlier.getFullYear()) * 12
               + (later.getMonth() - earlier.getMonth());

    // Desconta o mês em curso se o dia ainda não foi alcançado
    if (later.getDate() < earlier.getDate()) months--;

    return Math.max(0, months);
}

/**
 * Calcula a diferença absoluta em anos COMPLETOS entre duas datas.
 * O dia e o mês são considerados, tornando-a adequada para cálculo de idade.
 */
export function diffInYears(date1: RefDate, date2: RefDate): number {
    return Math.floor(diffInMonths(date1, date2) / 12);
}
