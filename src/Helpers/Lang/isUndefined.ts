import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `undefined`.
 * Semelhante ao _.isUndefined do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for `undefined`
 */
export function isUndefined(value: MaybeRefOrGetter<unknown>): boolean {
    return toValue(value) === undefined;
}
