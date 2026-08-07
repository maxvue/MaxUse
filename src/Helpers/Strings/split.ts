import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

const MAX_ARRAY_LENGTH = 4294967295;

/**
 * Divide uma string usando `separator`, limitada a `limit` elementos.
 * Semelhante ao _.split do Lodash.
 *
 * @param string string a dividir
 * @param separator separador (string ou RegExp)
 * @param limit número máximo de elementos no resultado
 * @returns array com os pedaços da string
 */
export function split(string: MaybeRefOrGetter<unknown>, separator?: MaybeRefOrGetter<string | RegExp>, limit?: MaybeRefOrGetter<number>): string[] {
    const lim = limit === undefined ? MAX_ARRAY_LENGTH : (toValue(limit) >>> 0);
    if (!lim) return [];

    const str = toString(toValue(string));
    const sep = separator === undefined ? undefined : toValue(separator);

    // Separador string vazia: divide por code point Unicode (não por
    // unidade UTF-16), para que caracteres astrais (emojis, etc.) virem um
    // único elemento, igual ao Lodash — `String#split('')` nativo quebraria
    // um caractere astral em dois surrogates.
    if (sep === '') return [...str].slice(0, lim);

    return str.split(sep as string | RegExp, lim);
}
