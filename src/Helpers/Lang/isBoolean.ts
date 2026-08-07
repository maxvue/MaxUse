import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um booleano primitivo ou um objeto `Boolean`.
 * Semelhante ao _.isBoolean do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um booleano
 */
export function isBoolean(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data === true || data === false || (Object.prototype.toString.call(data) === '[object Boolean]');
}
