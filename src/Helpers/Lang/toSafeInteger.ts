import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from './toInteger';

const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Converte um valor para um inteiro seguro, grampeado entre
 * `-Number.MAX_SAFE_INTEGER` e `Number.MAX_SAFE_INTEGER`.
 * Semelhante ao _.toSafeInteger do Lodash.
 *
 * @param value valor a converter
 * @returns inteiro seguro resultante
 */
export function toSafeInteger(value: MaybeRefOrGetter<unknown>): number {
    const data = toValue(value);
    if (!data) return data === 0 ? (data as number) : 0;

    const int = toInteger(data);
    if (int < -MAX_SAFE_INTEGER) return -MAX_SAFE_INTEGER;
    if (int > MAX_SAFE_INTEGER) return MAX_SAFE_INTEGER;
    return int;
}
