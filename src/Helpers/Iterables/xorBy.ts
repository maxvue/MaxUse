import { iteratee } from '../Utils/iteratee';
import { splitRestIteratee } from './_restIteratee';

/**
 * Como `xor`, mas aceita um `iteratee` (via `iteratee`) como **último**
 * argumento, usado para derivar o critério de comparação. Se o último
 * argumento não for um array, ele é tratado como o `iteratee`.
 * Semelhante ao _.xorBy do Lodash.
 *
 * @param arrays arrays a comparar, seguidos opcionalmente do iteratee
 * @returns novo array com a diferença simétrica, por critério
 */
export function xorBy<T>(...arrays: unknown[]): T[] {
    const [lists, rawIteratee] = splitRestIteratee<T>(arrays);
    const valid = lists.filter((list) => Array.isArray(list));

    const sameValueZero = (a: unknown, b: unknown) => a === b || (a !== a && b !== b);

    // Com menos de 2 arrays válidos, o Lodash faz um atalho: apenas
    // deduplica o único array (por SameValueZero puro), **sem** aplicar o
    // iteratee — mesmo que um tenha sido passado. Replica esse atalho.
    if (valid.length < 2) {
        if (valid.length === 0) return [];
        const dedup: T[] = [];
        for (const item of valid[0]) if (!dedup.some((existing) => sameValueZero(existing, item))) dedup.push(item);
        return dedup;
    }

    const fn = iteratee(rawIteratee) as (value: T) => unknown;
    const result: T[] = [];
    const addedKeys: unknown[] = [];

    for (const current of valid) for (const item of current) {
        const key = fn(item);
        const occurrences = valid.filter((arr) => arr.some((value) => sameValueZero(fn(value), key))).length;
        const alreadyAdded = addedKeys.some((k) => sameValueZero(k, key));
        if (occurrences === 1 && !alreadyAdded) {
            result.push(item);
            addedKeys.push(key);
        }
    }

    return result;
}
