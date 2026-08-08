import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um `Symbol` primitivo ou um objeto `Symbol`.
 * Semelhante ao _.isSymbol do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um symbol
 */
export function isSymbol(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'symbol' || (data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object Symbol]');
}
