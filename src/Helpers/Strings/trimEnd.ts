import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Remove espaços em branco (ou os caracteres de `chars`) do fim de uma
 * string.
 * Semelhante ao _.trimEnd do Lodash.
 *
 * @param string string a aparar
 * @param chars conjunto de caracteres a remover (padrão: espaços em branco)
 * @returns string aparada no fim
 */
export function trimEnd(string: MaybeRefOrGetter<unknown>, chars?: MaybeRefOrGetter<string>): string {
    const str = toString(toValue(string));
    if (!str) return str;

    const charSet = chars === undefined ? undefined : toString(toValue(chars));
    if (charSet === undefined) return str.replace(/\s+$/, '');
    if (!charSet) return str;

    let end = str.length;
    while (end > 0 && charSet.includes(str[end - 1])) end--;
    return str.slice(0, end);
}
