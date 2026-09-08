import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

export type FindLastPredicate<T> =
    | ((value: T, index: number, collection: any) => unknown)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

/**
 * Encontra o último item de uma coleção (array ou Record) que satisfaça uma condição
 * (via `iteratee` — aceita função, string, array `[path, srcValue]` ou objeto).
 * Percorre de trás para frente a partir de `fromIndex`.
 * Semelhante ao _.findLast do Lodash.
 *
 * @param collection A coleção para pesquisar (array ou Record).
 * @param predicate A condição a testar em cada elemento.
 * @param fromIndex Índice inicial da busca regressiva (padrão: último índice).
 * @returns Retorna o elemento correspondente encontrado, ou undefined.
 */
export function findLast<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    predicate?: FindLastPredicate<T>,
    fromIndex?: number
): T | undefined {
    const data = toValue(collection);

    if (!data || typeof data !== 'object') return undefined;

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) {
        const length = data.length;
        if (!length) return undefined;
        let start = fromIndex === undefined ? length - 1 : fromIndex < 0 ? Math.max(length + fromIndex, 0) : Math.min(fromIndex, length - 1);
        for (; start >= 0; start--) if (fn(data[start], start, data)) return data[start];
        return undefined;
    }

    const keys = Object.keys(data);
    const length = keys.length;
    if (!length) return undefined;
    let start = fromIndex === undefined ? length - 1 : fromIndex < 0 ? Math.max(length + fromIndex, 0) : Math.min(fromIndex, length - 1);
    for (; start >= 0; start--) {
        const key = keys[start];
        const val = (data as Record<string, T>)[key];
        if (fn(val, key, data)) return val;
    }
    return undefined;
}
