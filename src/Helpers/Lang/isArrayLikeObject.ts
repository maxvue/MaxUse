import { toValue, type MaybeRefOrGetter } from 'vue';
import { isArrayLike } from './isArrayLike';
import { isObjectLike } from './isObjectLike';

/**
 * Verifica se o valor é "array-like" **e** também "object-like" (ou seja,
 * exclui strings, que são array-like mas não object-like).
 * Semelhante ao _.isArrayLikeObject do Lodash.
 *
 * @param value valor a verificar
 * @returns `true` se o valor for array-like e object-like
 */
export function isArrayLikeObject(value: MaybeRefOrGetter<unknown>): boolean {
    const data = toValue(value);
    return isObjectLike(data) && isArrayLike(data);
}
