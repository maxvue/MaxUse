import { toValue, type MaybeRefOrGetter } from 'vue';
import { map } from './map';
import { flattenDepth } from './flattenDepth';

/**
 * Mapeia cada elemento de `collection` com `iterateeFn` (via `iteratee`) e
 * achata o resultado até `depth` níveis de profundidade.
 * Semelhante ao _.flatMapDepth do Lodash.
 *
 * @param collection array ou objeto a mapear
 * @param iterateeFn transformação a aplicar em cada elemento
 * @param depth profundidade máxima de achatamento (padrão `1`)
 * @returns array achatado até `depth` níveis com os resultados
 */
export function flatMapDepth<T = unknown, R = unknown>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn?: unknown, depth?: number): R[] {
    const data = toValue(collection);
    const mapped = map<T, unknown>(data, iterateeFn);
    return flattenDepth<R>(mapped, depth);
}
