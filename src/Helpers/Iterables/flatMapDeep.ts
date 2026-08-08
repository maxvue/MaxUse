import { toValue, type MaybeRefOrGetter } from 'vue';
import { map } from './map';
import { flattenDeep } from './flattenDeep';

/**
 * Mapeia cada elemento de `collection` com `iterateeFn` (via `iteratee`) e
 * achata o resultado recursivamente, em qualquer profundidade.
 * Semelhante ao _.flatMapDeep do Lodash.
 *
 * @param collection array ou objeto a mapear
 * @param iterateeFn transformação a aplicar em cada elemento
 * @returns array totalmente achatado com os resultados
 */
export function flatMapDeep<T = unknown, R = unknown>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn?: unknown): R[] {
    const data = toValue(collection);
    const mapped = map<T, unknown>(data, iterateeFn);
    return flattenDeep<R>(mapped);
}
