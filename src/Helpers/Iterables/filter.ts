import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

export type FilterPredicate<T> =
    | ((value: T, indexOrKey: any, collection: any) => unknown)
    | PropertyKey
    | [PropertyKey, unknown]
    | Record<string, any>;

/**
 * Filtra uma coleção com base em um predicado (via `iteratee` — aceita função,
 * string de propriedade/caminho profundo, array `[path, srcValue]` ou objeto).
 *
 * Entradas `null`/`undefined` ou primitivas devolvem um array vazio,
 * seguindo o contrato do `_.filter` do Lodash. Para um Record, a MaxUse
 * mantém a extensão de devolver um Record com as chaves preservadas.
 *
 * @param collection A coleção de objetos.
 * @param predicate A função de predicado ou shorthand para avaliar cada item.
 * @returns A coleção filtrada.
 */
export function filter<T>(
    collection: MaybeRefOrGetter<T[]>,
    predicate?: ((value: T, index: number, collection: T[]) => unknown) | FilterPredicate<T>
): T[];
export function filter<T>(
    collection: MaybeRefOrGetter<Record<string, T>>,
    predicate?: ((value: T, key: string, collection: Record<string, T>) => unknown) | FilterPredicate<T>
): Record<string, T>;
export function filter<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    predicate?: FilterPredicate<T>
): T[] | Record<string, T>;
export function filter<T>(
    collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    predicate?: FilterPredicate<T>
): T[] | Record<string, T> {
    const data = toValue(collection);

    if (data == null) return [];

    if (typeof data !== 'object') return [];

    const fn = iteratee(predicate) as (value: T, key: number | string, collection: unknown) => unknown;

    if (Array.isArray(data)) return data.filter((item, index) => Boolean(fn(item, index, data)));

    return Object.fromEntries(
        Object.entries(data).filter(([key, item]) => Boolean(fn(item as T, key, data)))
    ) as Record<string, T>;
}
