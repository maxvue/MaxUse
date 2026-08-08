import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Converte uma string para minúsculas.
 * Semelhante ao _.toLower do Lodash.
 *
 * @param value valor a converter
 * @returns string em minúsculas
 */
export function toLower(value: MaybeRefOrGetter<unknown>): string {
    const data = toValue(value);
    return toString(data).toLowerCase();
}
