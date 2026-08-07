import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `ArrayBuffer`.
 * Semelhante ao _.isArrayBuffer do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um `ArrayBuffer`
 */
export function isArrayBuffer(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data !== null && typeof data === 'object' && Object.prototype.toString.call(data) === '[object ArrayBuffer]';
}
