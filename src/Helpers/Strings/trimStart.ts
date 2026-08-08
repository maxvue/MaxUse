import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Remove espaços em branco (ou os caracteres de `chars`) do início de uma
 * string.
 * Semelhante ao _.trimStart do Lodash.
 *
 * @param string string a aparar
 * @param chars conjunto de caracteres a remover (padrão: espaços em branco)
 * @returns string aparada no início
 */
export function trimStart(string: MaybeRefOrGetter<unknown>, chars?: MaybeRefOrGetter<string>): string {
    const str = toString(toValue(string));
    if (!str) return str;

    const charSet = chars === undefined ? undefined : toString(toValue(chars));
    if (charSet === undefined) return str.replace(/^\s+/, '');
    if (!charSet) return str;

    let start = 0;
    while (start < str.length && charSet.includes(str[start])) start++;
    return str.slice(start);
}
