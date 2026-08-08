import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { keys } from './keys';

/**
 * Cria um objeto com as mesmas propriedades de `object`, mas com as
 * chaves derivadas de `iterateeFn` (via `iteratee` — aceita função,
 * string, array `[path, srcValue]` ou objeto), invocada com
 * `(value, key, object)`.
 * Semelhante ao _.mapKeys do Lodash.
 *
 * @param object objeto de origem
 * @param iterateeFn função (ou shorthand) que deriva a nova chave a partir de cada valor
 * @returns novo objeto com as chaves remapeadas
 */
export function mapKeys(object: MaybeRefOrGetter<unknown>, iterateeFn?: unknown): Record<string, unknown> {
    const data = toValue(object);
    const result: Record<string, unknown> = {};
    if (data == null) return result;

    const fn = iteratee(iterateeFn) as (value: unknown, key: string, object: unknown) => unknown;

    for (const key of keys(data)) {
        const value = (data as Record<string, unknown>)[key];
        result[String(fn(value, key, data))] = value;
    }

    return result;
}
