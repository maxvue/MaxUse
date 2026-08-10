import { toValue, type MaybeRefOrGetter } from 'vue';
import { isNotValid } from '../Validations';
import { diffInMonths, diffInYears } from './differences';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

/**
 * Calcula quantos segundos se passaram desde uma data (clamped em 0 para datas futuras).
 *
 * @param value - A data de referência (aceita Date, timestamp, string ISO ou valores reativos).
 * @returns O número de segundos desde a data. Retorna 0 se o valor for inválido ou futuro.
 */
export function secondsAgo(value: RefDate): number {
    const data = toValue(value);
    if (isNotValid(data)) return 0;

    const date = new Date(data);
    if (isNaN(date.getTime())) return 0;

    const diferencaMs = Date.now() - date.getTime();
    return Math.max(0, Math.floor(diferencaMs / 1000));
}

/**
 * Calcula quantos minutos se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de minutos desde a data. Retorna 0 se o valor for inválido.
 */
export function minutesAgo(value: RefDate): number {
    return Math.floor(secondsAgo(value) / 60);
}

/**
 * Calcula quantas horas se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de horas desde a data. Retorna 0 se o valor for inválido.
 */
export function hoursAgo(value: RefDate): number {
    return Math.floor(minutesAgo(value) / 60);
}

/**
 * Calcula quantos dias se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de dias desde a data. Retorna 0 se o valor for inválido.
 */
export function daysAgo(value: RefDate): number {
    return Math.floor(hoursAgo(value) / 24);
}

/**
 * Calcula quantos meses se passaram desde uma data (usando calendário).
 *
 * @param value - A data de referência.
 * @returns O número de meses desde a data. Retorna 0 se o valor for inválido ou futuro.
 */
export function monthsAgo(value: RefDate): number {
    const data = toValue(value);
    if (isNotValid(data)) return 0;
    const date = new Date(data);
    if (isNaN(date.getTime()) || date.getTime() > Date.now()) return 0;
    return diffInMonths(date, new Date());
}

/**
 * Calcula quantos anos se passaram desde uma data (usando calendário).
 *
 * @param value - A data de referência.
 * @returns O número de anos desde a data. Retorna 0 se o valor for inválido ou futuro.
 */
export function yearsAgo(value: RefDate): number {
    const data = toValue(value);
    if (isNotValid(data)) return 0;
    const date = new Date(data);
    if (isNaN(date.getTime()) || date.getTime() > Date.now()) return 0;
    return diffInYears(date, new Date());
}