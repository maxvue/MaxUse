import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um objeto `Set`.
 * Semelhante ao _.isSet do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um `Set`
 */
export function isSet(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return data instanceof Set;
}
