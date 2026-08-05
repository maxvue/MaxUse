import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `null` ou `undefined`.
 * Semelhante ao _.isNil do Lodash.
 *
 * @param value O valor a ser verificado.
 * @returns `true` quando o valor for `null` ou `undefined`.
 */
export function isNil(value: MaybeRefOrGetter<unknown>): boolean {
    return toValue(value) == null;
}
