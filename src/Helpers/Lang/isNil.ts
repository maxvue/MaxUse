import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é `null` ou `undefined`.
 * Semelhante ao _.isNil do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for `null` ou `undefined`
 */
export function isNil(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data === null || data === undefined;
}
