import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee as toIteratee } from '../Utils/iteratee';

export type GroupByIteratee<T> =
    | ((item: T, keyOrIndex: any, collection: any) => PropertyKey)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

/**
 * Agrupa os elementos de uma coleção de acordo com o resultado de um iteratee
 * (função, propriedade, caminho profundo pontuado, matches ou matchesProperty).
 * Semelhante ao _.groupBy do Lodash.
 *
 * @param collection A coleção para iterar (array ou Record).
 * @param iterateeFn O iteratee para transformar/extrair as chaves.
 * @returns Retorna o objeto agrupado.
 */
export function groupBy<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    iterateeFn?: GroupByIteratee<T>
): Record<string, T[]> {
    const data = toValue(collection);
    if (!data || typeof data !== 'object') return {};

    const fn = toIteratee(iterateeFn);
    const result: Record<string, T[]> = {};

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const groupKey = String(fn(item, i, data));
            if (!result[groupKey]) result[groupKey] = [];
            result[groupKey].push(item);
        }
    } else {
        for (const [key, item] of Object.entries(data)) {
            const groupKey = String(fn(item, key, data));
            if (!result[groupKey]) result[groupKey] = [];
            result[groupKey].push(item as T);
        }
    }

    return result;
}
