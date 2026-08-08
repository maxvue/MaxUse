import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um número inteiro.
 * Semelhante ao _.isInteger do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um inteiro
 */
export function isInteger(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'number' && Number.isInteger(data);
}
