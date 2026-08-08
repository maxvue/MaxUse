import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Remove **em lugar** (mutando `array`) todos os elementos para os quais
 * `predicate` (via `iteratee`) retorna valor verdadeiro, e retorna um novo
 * array com os elementos removidos. Diferente de `filter`, `remove`
 * modifica o array recebido.
 * Semelhante ao _.remove do Lodash.
 *
 * @param array array a mutar
 * @param predicate condição a testar em cada elemento
 * @returns array com os elementos removidos
 */
export function remove<T>(array: MaybeRefOrGetter<T[] | null | undefined>, predicate?: unknown): T[] {
    const data = toValue(array);
    const removed: T[] = [];
    if (data == null) return removed;

    const fn = iteratee(predicate) as (value: T, index: number, collection: unknown) => unknown;
    let index = 0;

    while (index < data.length) {
        const value = data[index];
        if (fn(value, index, data)) {
            removed.push(value);
            data.splice(index, 1);
        } else index++;

    }

    return removed;
}
