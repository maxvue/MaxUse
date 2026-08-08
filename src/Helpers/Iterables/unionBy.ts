import { iteratee } from '../Utils/iteratee';
import { splitRestIteratee } from './_restIteratee';

/**
 * Como `union`, mas aceita um `iteratee` (via `iteratee`) como **último**
 * argumento, usado para derivar o critério de unicidade. Se o último
 * argumento não for um array, ele é tratado como o `iteratee`. O valor
 * resultante é o da primeira ocorrência de cada critério.
 * Semelhante ao _.unionBy do Lodash.
 *
 * @param arrays arrays a unir, seguidos opcionalmente do iteratee
 * @returns novo array com a união, sem duplicatas por critério
 */
export function unionBy<T>(...arrays: unknown[]): T[] {
    const [lists, rawIteratee] = splitRestIteratee<T>(arrays);
    const fn = iteratee(rawIteratee) as (value: T) => unknown;

    const flat = lists.filter((list) => Array.isArray(list)).flat(1) as T[];
    const result: T[] = [];
    const seen: unknown[] = [];

    for (const item of flat) {
        const key = fn(item);
        if (!seen.some((k) => k === key || (k !== k && key !== key))) {
            seen.push(key);
            result.push(item);
        }
    }

    return result;
}
