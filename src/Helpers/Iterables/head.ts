import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Retorna o primeiro elemento do array.
 * Semelhante ao _.head do Lodash.
 *
 * @param array array de entrada
 * @returns primeiro elemento, ou `undefined` se vazio/nulo
 */
export function head<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T | undefined {
    const data = toValue(array);
    return data && data.length ? data[0] : undefined;
}
