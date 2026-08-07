import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `arguments`.
 * Semelhante ao _.isArguments do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um objeto `arguments`
 */
export function isArguments(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object Arguments]';
}
