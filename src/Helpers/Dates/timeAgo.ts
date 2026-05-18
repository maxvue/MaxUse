import { toValue, type MaybeRefOrGetter } from 'vue';
import { isNotValid } from '../Validations';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

export function secondsAgo(value: RefDate): number {
    const data = toValue(value);
    if (isNotValid(data)) return 0;

    const date = new Date(data);

    const dataPassada: Date = new Date(date);
    const agora: Date = new Date();

    const diferencaMs: number = agora.getTime() - dataPassada.getTime();

    return parseInt(Math.floor(diferencaMs / 1000) + '');
}

export function minutesAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 + '');
}

export function hoursAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 + '');
}

export function daysAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 + '');
}

export function monthsAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 + '');
}

export function yearsAgo(value: RefDate): number {
    return parseInt((secondsAgo(value) || 0) / 60 / 60 / 24 / 30 / 12 + '');
}