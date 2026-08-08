import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `Map`.
 * Semelhante ao _.isMap do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um `Map`
 */
export function isMap(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data instanceof Map;
}
