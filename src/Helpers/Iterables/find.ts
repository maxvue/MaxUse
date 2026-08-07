import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Retorna o primeiro elemento de `collection` para o qual `predicate` (via
 * `iteratee` — aceita função, string, array `[path, srcValue]` ou objeto)
 * retorna valor verdadeiro. Aceita array ou objeto (itera pelas chaves na
 * ordem de `Object.keys`).
 * Semelhante ao _.find do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param predicate condição a testar em cada elemento
 * @param fromIndex índice inicial (apenas para array; negativo conta do fim)
 * @returns o primeiro elemento que casa, ou `undefined`
 */
export function find<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, predicate?: unknown, fromIndex = 0): T | undefined {
    const data = toValue(collection);
    if (data == null) return undefined;

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) {
        const length = data.length;
        let start = fromIndex < 0 ? Math.max(length + fromIndex, 0) : fromIndex;
        for (; start < length; start++) if (fn(data[start], start, data)) return data[start];
        return undefined;
    }

    for (const key of Object.keys(data)) if (fn((data as Record<string, T>)[key], key, data)) return (data as Record<string, T>)[key];
    return undefined;
}
