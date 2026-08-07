import { toValue, type MaybeRefOrGetter } from 'vue';

const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Verifica se o valor é um comprimento válido — um inteiro não-negativo
 * menor ou igual a `Number.MAX_SAFE_INTEGER`.
 * Semelhante ao _.isLength do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for um comprimento válido
 */
export function isLength(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return typeof data === 'number' && data > -1 && data % 1 === 0 && data <= MAX_SAFE_INTEGER;
}
