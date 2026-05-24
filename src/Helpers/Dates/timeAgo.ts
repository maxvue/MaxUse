import { toValue, type MaybeRefOrGetter } from 'vue';
import { isNotValid } from '../Validations';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

/**
 * Calcula quantos segundos se passaram desde uma data.
 *
 * @param value - A data de referência (aceita Date, timestamp, string ISO ou valores reativos).
 * @returns O número de segundos desde a data. Retorna 0 se o valor for inválido.
 */
export function secondsAgo(value: RefDate): number {
    const data = toValue(value);
    if (isNotValid(data)) return 0;

    const date = new Date(data);

    const dataPassada: Date = new Date(date);
    const agora: Date = new Date();

    const diferencaMs: number = agora.getTime() - dataPassada.getTime();

    return parseInt(Math.floor(diferencaMs / 1000) + '');
}

/**
 * Calcula quantos minutos se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de minutos desde a data. Retorna 0 se o valor for inválido.
 */
export function minutesAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 + '');
}

/**
 * Calcula quantas horas se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de horas desde a data. Retorna 0 se o valor for inválido.
 */
export function hoursAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 + '');
}

/**
 * Calcula quantos dias se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de dias desde a data. Retorna 0 se o valor for inválido.
 */
export function daysAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 + '');
}

/**
 * Calcula quantos meses (aproximados, base 30 dias) se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de meses desde a data. Retorna 0 se o valor for inválido.
 */
export function monthsAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 + '');
}

/**
 * Calcula quantos anos (aproximados, base 360 dias) se passaram desde uma data.
 *
 * @param value - A data de referência.
 * @returns O número de anos desde a data. Retorna 0 se o valor for inválido.
 */
export function yearsAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 / 12 + '');
}