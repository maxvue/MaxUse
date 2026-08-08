import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Cria um array com os resultados de invocar `iterateeFn` (via `iteratee`
 * — aceita função, string, array `[path, srcValue]` ou objeto) para cada
 * elemento de `collection`. Aceita array ou objeto: para objeto, itera
 * sobre os valores próprios enumeráveis, sempre retornando um array
 * (nunca um objeto).
 * Semelhante ao _.map do Lodash.
 *
 * @param collection array ou objeto a mapear
 * @param iterateeFn transformação a aplicar em cada elemento
 * @returns array com os resultados
 */
export function map<T = unknown, R = unknown>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn?: unknown): R[] {
    const data = toValue(collection);
    if (data == null) return [];

    const fn = iteratee(iterateeFn) as (value: T, key: number | string, collection: unknown) => R;

    if (Array.isArray(data)) return data.map((item, index) => fn(item, index, data));

    return Object.keys(data).map((key) => fn((data as Record<string, T>)[key], key, data));
}
