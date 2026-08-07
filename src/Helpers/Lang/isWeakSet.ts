import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `WeakSet`.
 * Semelhante ao _.isWeakSet do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um `WeakSet`
 */
export function isWeakSet(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data instanceof WeakSet;
}
