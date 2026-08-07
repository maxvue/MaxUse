import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { keysIn } from './keysIn';

/**
 * Retorna a **chave** do primeiro elemento de `object` (na ordem de
 * `keysIn`) para o qual `predicate` (via `iteratee` — aceita função,
 * string, array `[path, srcValue]` ou objeto) retorna valor verdadeiro.
 * Semelhante ao _.findKey do Lodash.
 *
 * @param object objeto a percorrer
 * @param predicate condição a testar em cada valor
 * @returns a chave do primeiro valor que casa, ou `undefined`
 */
export function findKey(object: MaybeRefOrGetter<unknown>, predicate?: unknown): string | undefined {
    const data = toValue(object);
    if (data == null) return undefined;

    const fn = iteratee(predicate) as (value: unknown, key: string, collection: unknown) => unknown;
    for (const key of keysIn(data)) if (fn((data as Record<string, unknown>)[key], key, data)) return key;
    return undefined;
}
