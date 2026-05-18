import { toValue, type MaybeRefOrGetter } from 'vue';
import { isNotValid } from '../Validations';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

function parseDate(value: RefDate): Date | null {
    const data = toValue(value);
    if (isNotValid(data)) return null;

    const date = new Date(data);
    return isNaN(date.getTime()) ? null : date;
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
 * Calcula a diferença absoluta em meses entre duas datas.
 */
export function diffInMonths(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;

    const years = d1.getFullYear() - d2.getFullYear();
    const months = d1.getMonth() - d2.getMonth();
    return Math.abs(years * 12 + months);
}

/**
 * Calcula a diferença absoluta em anos entre duas datas.
 */
export function diffInYears(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;
    return Math.abs(d1.getFullYear() - d2.getFullYear());
}
