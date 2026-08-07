import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é uma string primitiva ou um objeto `String`.
 * Semelhante ao _.isString do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for uma string
 */
export function isString(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'string' || (!Array.isArray(data) && data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object String]');
}
