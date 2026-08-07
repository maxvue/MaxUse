import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `null`.
 * Semelhante ao _.isNull do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for `null`
 */
export function isNull(value: MaybeRefOrGetter<unknown>): boolean {
    return toValue(value) === null;
}
