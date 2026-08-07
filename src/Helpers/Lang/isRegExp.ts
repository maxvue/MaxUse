import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `RegExp`.
 * Semelhante ao _.isRegExp do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for uma expressão regular
 */
export function isRegExp(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data instanceof RegExp || (data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object RegExp]');
}
