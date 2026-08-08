import { toValue, type MaybeRefOrGetter } from 'vue';
import { words } from './words';
import { deburr } from './deburr';
import { upperFirst } from './upperFirst';

const reApos = /['’]/g;

/**
 * Converte `string` para start case — extrai as palavras (via `words`, após
 * `deburr` e remoção de apóstrofos) e as junta com um único espaço, cada uma
 * com a inicial em maiúscula e o restante intacto (`FOO` continua `FOO`).
 * Semelhante ao _.startCase do Lodash.
 *
 * @param string valor a converter
 * @returns string com as palavras separadas por espaço, cada uma capitalizada
 */
export function startCase(string: MaybeRefOrGetter<unknown>): string {
    const data = toValue(string);
    const clean = String(deburr(data)).replace(reApos, '');
    return words(clean).reduce((result, word, index) => result + (index ? ' ' : '') + upperFirst(word), '');
}
