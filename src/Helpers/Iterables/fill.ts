import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Preenche os elementos do array entre `start` e `end` (exclusivo) com
 * `value`. **Muta** o array de entrada.
 * Semelhante ao _.fill do Lodash.
 *
 * @param array array a preencher (mutado in-place)
 * @param value valor usado para preencher
 * @param start índice inicial (padrão `0`)
 * @param end índice final, exclusivo (padrão `array.length`)
 * @returns o próprio array, preenchido
 */
export function fill<T, V>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    value: V,
    start?: number,
    end?: number
): Array<T | V> {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return [];

    const rawFrom = start == null ? 0 : toInteger(start);
    const rawTo = end === undefined ? length : toInteger(end);
    const from = rawFrom < 0 ? Math.max(length + rawFrom, 0) : Math.min(rawFrom, length);
    const to = rawTo < 0 ? Math.max(length + rawTo, 0) : Math.min(rawTo, length);
    const result = data as unknown as Array<T | V>;

    for (let index = from; index < to; index++) result[index] = value;

    return result;
}
