import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Remove espaços em branco (ou os caracteres de `chars`) do início e do
 * fim de uma string.
 * Semelhante ao _.trim do Lodash.
 *
 * @param string string a aparar
 * @param chars conjunto de caracteres a remover (padrão: espaços em branco)
 * @returns string aparada
 */
export function trim(string: MaybeRefOrGetter<unknown>, chars?: MaybeRefOrGetter<string>): string {
    const str = toString(toValue(string));
    if (!str) return str;

    const charSet = chars === undefined ? undefined : toString(toValue(chars));
    if (charSet === undefined) return str.trim();
    if (!charSet) return str;

    let start = 0;
    let end = str.length;
    while (start < end && charSet.includes(str[start])) start++;
    while (end > start && charSet.includes(str[end - 1])) end--;
    return str.slice(start, end);
}
