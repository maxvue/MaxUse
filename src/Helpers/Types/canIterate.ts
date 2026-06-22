import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Verifica se um objeto é iterável.
 *
 * @param obj O objeto a ser verificado.
 * @returns Retorna true se for iterável.
 */
export function canIterate<T>(obj: MaybeRefOrGetter<any>): obj is Iterable<T> {
    const data = toValue(obj);
    return typeof data?.[Symbol.iterator] === 'function';
}

export const isIterable = canIterate;
