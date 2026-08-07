import { toValue, type MaybeRefOrGetter } from 'vue';
import { map } from './map';
import { flatten } from './flatten';

/**
 * Mapeia cada elemento de `collection` com `iterateeFn` (via `iteratee` —
 * aceita função, string, array `[path, srcValue]` ou objeto) e achata o
 * resultado em 1 nível de profundidade.
 * Semelhante ao _.flatMap do Lodash.
 *
 * @param collection array ou objeto a mapear
 * @param iterateeFn transformação a aplicar em cada elemento
 * @returns array achatado com os resultados
 */
export function flatMap<T = unknown, R = unknown>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn?: unknown): R[] {
    const data = toValue(collection);
    const mapped = map<T, R | R[]>(data, iterateeFn);
    return flatten(mapped as Array<R | R[]>);
}
