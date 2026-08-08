import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/**
 * Escapa os caracteres especiais de RegExp (`^ $ . * + ? ( ) [ ] { } | \`)
 * de uma string, para uso seguro dentro de um `new RegExp(...)`.
 * Semelhante ao _.escapeRegExp do Lodash.
 *
 * @param value string a escapar
 * @returns string com os caracteres especiais de regex escapados
 */
export function escapeRegExp(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    return str ? str.replace(reRegExpChar, '\\$&') : str;
}
