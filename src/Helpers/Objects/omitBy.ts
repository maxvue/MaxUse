import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { keysIn } from './keysIn';

/**
 * O oposto de `pickBy`: cria um objeto com as propriedades **próprias e
 * herdadas** de `object` para as quais `predicate` (via `iteratee` —
 * aceita função, string, array `[path, srcValue]` ou objeto) retorna
 * valor **falso**. O predicado é invocado com `(value, key)`.
 * Semelhante ao _.omitBy do Lodash.
 *
 * @param object objeto de origem
 * @param predicate condição a testar em cada valor
 * @returns novo objeto sem as propriedades que casaram
 */
export function omitBy<T extends object>(object: MaybeRefOrGetter<T | null | undefined>, predicate?: unknown): Partial<T> {
    const data = toValue(object);
    const result: Partial<T> = {};
    if (data == null) return result;

    const fn = iteratee(predicate) as (value: unknown, key: string) => unknown;

    for (const key of keysIn(data)) {
        const value = (data as Record<string, unknown>)[key];
        if (!fn(value, key)) (result as Record<string, unknown>)[key] = value;
    }

    return result;
}
