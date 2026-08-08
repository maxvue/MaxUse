import { toValue, type MaybeRefOrGetter } from 'vue';
import { words } from './words';
import { deburr } from './deburr';

const reApos = /['’]/g;

/**
 * Converte `string` para maiúsculas, tratando-a como palavras separadas
 * por espaço — extrai as palavras (via `words`, após `deburr` e remoção
 * de apóstrofos) e as junta com um único espaço, cada uma em maiúsculas.
 * Semelhante ao _.upperCase do Lodash.
 *
 * @param string valor a converter
 * @returns string com as palavras separadas por espaço, em maiúsculas
 */
export function upperCase(string: MaybeRefOrGetter<unknown>): string {
    const data = toValue(string);
    const clean = String(deburr(data)).replace(reApos, '');
    return words(clean).reduce((result, word, index) => result + (index ? ' ' : '') + word.toUpperCase(), '');
}
