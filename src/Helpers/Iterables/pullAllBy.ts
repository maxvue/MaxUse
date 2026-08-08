import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';

/**
 * Como `pullAll`, mas aceita `iterateeFn` (via `iteratee` — aceita
 * função, string, array `[path, srcValue]` ou objeto) para derivar o
 * critério de comparação. **Muta** o array de entrada.
 * Semelhante ao _.pullAllBy do Lodash.
 *
 * @param array array a modificar (mutado in-place)
 * @param values array de valores cujo critério deve ser removido
 * @param iterateeFn função (ou shorthand) que deriva o critério de comparação
 * @returns o próprio array, sem os valores removidos
 */
export function pullAllBy<T>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    values: MaybeRefOrGetter<T[] | null | undefined>,
    iterateeFn?: unknown
): T[] | null | undefined {
    const data = toValue(array);
    const vals = toValue(values);
    if (!data || !data.length || !vals || !vals.length) return data;

    const fn = iteratee(iterateeFn) as (value: T) => unknown;
    const excludedKeys = vals.map((value) => fn(value));

    let index = 0;
    while (index < data.length) {
        const key = fn(data[index]);
        if (excludedKeys.some((k) => k === key || (k !== k && key !== key))) data.splice(index, 1);
        else index++;
    }

    return data;
}
