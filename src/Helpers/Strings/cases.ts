import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { words } from './words';
import { deburr } from './deburr';
import { upperFirst } from './upperFirst';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

const reApos = /['’]/g;

/**
 * Extrai as palavras de um valor, do mesmo modo que o `startCase`: `deburr`
 * (que também cobre `ß` → `ss`), remoção de apóstrofos (contrações como
 * `O'Brien's` viram um único token) e tokenização pelo `words`, que é o port
 * fiel do algoritmo do Lodash — inclusive para siglas (`FOO_BAR` → `FOO`,
 * `BAR`) e dígitos colados a letras (`text123text` → `text`, `123`, `text`).
 *
 * @param value valor a tokenizar
 * @returns array das palavras encontradas
 */
function caseWords(value: unknown): string[] {
    return words(toString(deburr(toValue(value))).replace(reApos, ''));
}

/**
 * Converte uma string para o formato snake_case.
 * Semelhante ao _.snakeCase do Lodash.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato snake_case.
 */
export function snakeCase(value: RefString): string {
    return caseWords(value).reduce((result, word, index) => result + (index ? '_' : '') + word.toLowerCase(), '');
}

/**
 * Converte uma string para o formato kebab-case.
 * Semelhante ao _.kebabCase do Lodash.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato kebab-case.
 */
export function kebabCase(value: RefString): string {
    return caseWords(value).reduce((result, word, index) => result + (index ? '-' : '') + word.toLowerCase(), '');
}

/**
 * Converte uma string para o formato camelCase.
 * Semelhante ao _.camelCase do Lodash.
 *
 * @param value A string a ser convertida.
 * @returns A string em formato camelCase.
 */
export function camelCase(value: RefString): string {
    return caseWords(value).reduce((result, word, index) => {
        const lower = word.toLowerCase();
        return result + (index ? upperFirst(lower) : lower);
    }, '');
}

/**
 * Garante que apenas a primeira letra da string seja maiúscula e o restante minúscula.
 * Semelhante ao _.capitalize do Lodash.
 *
 * @param value A string a ser formatada.
 */
export function capitalize(value: RefString): string {
    return upperFirst(toString(toValue(value)).toLowerCase());
}
