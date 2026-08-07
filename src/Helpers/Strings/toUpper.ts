import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Converte uma string para maiúsculas.
 * Semelhante ao _.toUpper do Lodash.
 *
 * @param value valor a converter
 * @returns string em maiúsculas
 */
export function toUpper(value: MaybeRefOrGetter<unknown>): string {
    const data = toValue(value);
    return toString(data).toUpperCase();
}
