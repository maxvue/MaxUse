import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from './toInteger';

const MAX_ARRAY_LENGTH = 4294967295;

/**
 * Converte um valor para um comprimento de array válido — um inteiro
 * grampeado entre `0` e `4294967295` (`2**32 - 1`).
 * Semelhante ao _.toLength do Lodash.
 *
 * @param value valor a converter
 * @returns comprimento resultante
 */
export function toLength(value: MaybeRefOrGetter<unknown>): number {
    const data = toValue(value);
    if (!data) return 0;

    const int = toInteger(data);
    if (int < 0) return 0;
    if (int > MAX_ARRAY_LENGTH) return MAX_ARRAY_LENGTH;
    return int;
}
