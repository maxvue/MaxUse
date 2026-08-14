import { toValue, type MaybeRefOrGetter } from 'vue';
import { iteratee } from '../Utils/iteratee';
import { splitRestIteratee } from './_restIteratee';

/**
 * Como `difference`, mas aceita um `iteratee` (via `iteratee` — aceita
 * função, string, array `[path, srcValue]` ou objeto) como **último**
 * argumento, usado para derivar o critério de comparação entre os
 * elementos de `array` e de `values`. Se o último argumento não for um
 * array, ele é tratado como o `iteratee`; caso contrário, usa-se
 * identidade.
 * Semelhante ao _.differenceBy do Lodash.
 *
 * @param array array de entrada
 * @param values arrays de valores a excluir, seguidos opcionalmente do iteratee
 * @returns novo array com a diferença, por critério
 */
export function differenceBy<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: unknown[]): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const [arrays, rawIteratee] = splitRestIteratee<T>(values);
    const fn = iteratee(rawIteratee) as (value: T) => unknown;

    const excludedKeys = new Set<unknown>();
    for (const value of arrays) if (Array.isArray(value)) for (const item of value) excludedKeys.add(fn(item));

    return data.filter((item) => !excludedKeys.has(fn(item)));
}
