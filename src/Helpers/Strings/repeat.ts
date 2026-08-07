import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { toInteger } from '../Lang/toInteger';

/**
 * Repete uma string `n` vezes.
 * Semelhante ao _.repeat do Lodash.
 *
 * @param string string a repetir
 * @param n número de repetições (padrão `1`)
 * @returns string repetida
 */
export function repeat(string: MaybeRefOrGetter<unknown>, n?: MaybeRefOrGetter<number>): string {
    const str = toString(toValue(string));
    const count = n === undefined ? 1 : toInteger(toValue(n));
    if (count < 1 || !str) return count < 1 ? '' : str;
    return str.repeat(count);
}
