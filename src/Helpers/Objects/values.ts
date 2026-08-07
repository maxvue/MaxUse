import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Retorna os valores das chaves próprias enumeráveis de um objeto. Para
 * valores array-like (arrays, strings, argumentos), retorna os elementos na
 * ordem dos índices.
 * Semelhante ao _.values do Lodash.
 *
 * @param object objeto, array ou string
 * @returns array de valores
 */
export function values<T = unknown>(object: MaybeRefOrGetter<unknown>): T[] {
    const data = toValue(object);
    if (data == null) return [];

    return keys(data).map((key) => (data as Record<string, T>)[key]);
}
