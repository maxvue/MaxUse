import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se o valor é um inteiro seguro (dentro do intervalo
 * representável sem perda de precisão em ponto flutuante).
 * Semelhante ao _.isSafeInteger do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um inteiro seguro
 */
export function isSafeInteger(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'number' && Number.isSafeInteger(data);
}
