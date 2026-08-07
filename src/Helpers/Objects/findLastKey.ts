import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { keysIn } from './keysIn';

/**
 * Como `findKey`, mas percorre `object` na ordem inversa das chaves
 * (`keysIn` invertida), retornando a chave do **último** elemento que
 * casa com `predicate` (via `iteratee`).
 * Semelhante ao _.findLastKey do Lodash.
 *
 * @param object objeto a percorrer
 * @param predicate condição a testar em cada valor
 * @returns a chave do último valor que casa, ou `undefined`
 */
export function findLastKey(object: MaybeRefOrGetter<unknown>, predicate?: unknown): string | undefined {
    const data = toValue(object);
    if (data == null) return undefined;

    const fn = iteratee(predicate) as (value: unknown, key: string, collection: unknown) => unknown;
    const objKeys = keysIn(data);
    for (let index = objKeys.length - 1; index >= 0; index--) {
        const key = objKeys[index];
        if (fn((data as Record<string, unknown>)[key], key, data)) return key;
    }
    return undefined;
}
