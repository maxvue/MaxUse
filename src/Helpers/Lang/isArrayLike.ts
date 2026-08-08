import { toValue, type MaybeRefOrGetter } from 'vue';
import { isLength } from './isLength';

/**
 * Verifica se o valor é "array-like": não é `null`/`undefined`, não é uma
 * função e tem uma propriedade `length` que é um comprimento válido.
 * Semelhante ao _.isArrayLike do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for array-like
 */
export function isArrayLike(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    if (data === null || data === undefined || typeof data === 'function') return false;

    const length = (data as { length?: unknown }).length;
    return isLength(length);
}
