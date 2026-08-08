import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Substitui as ocorrências de `pattern` por `replacement` em `string`.
 * Semelhante ao _.replace do Lodash.
 *
 * @param string string de origem
 * @param pattern padrão a substituir (string ou RegExp)
 * @param replacement string de substituição, ou função substituidora
 * @returns string com as substituições aplicadas
 */
export function replace(string: MaybeRefOrGetter<unknown>, pattern: string | RegExp, replacement: string | ((substring: string, ...args: unknown[]) => string)): string {
    const str = toString(toValue(string));
    return str.replace(pattern, replacement as string);
}
