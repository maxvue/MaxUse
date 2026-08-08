import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `WeakMap`.
 * Semelhante ao _.isWeakMap do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um `WeakMap`
 */
export function isWeakMap(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data instanceof WeakMap;
}
