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

    // Com menos de 2 arrays válidos, o Lodash faz um atalho: apenas
    // deduplica o único array (por SameValueZero puro), **sem** aplicar o
    // iteratee — mesmo que um tenha sido passado. Replica esse atalho.
    if (valid.length < 2) {
        if (valid.length === 0) return [];
        const dedup: T[] = [];
        const seen = new Set<T>();
        for (const item of valid[0]) if (!seen.has(item)) {
            seen.add(item);
            dedup.push(item);
        }
        return dedup;
    }

    const fn = iteratee(rawIteratee) as (value: T) => unknown;

    // As chaves são derivadas uma única vez por elemento (O(n) invocações do
    // iteratee) e indexadas em `Set`, tornando a contagem de ocorrências O(k)
    // com k = número de arrays.
    const keysByList = valid.map((list) => list.map((value) => fn(value)));
    const sets = keysByList.map((keys) => new Set(keys));

    const result: T[] = [];
    const addedKeys = new Set<unknown>();

    for (let listIndex = 0; listIndex < valid.length; listIndex++) {
        const current = valid[listIndex];
        const currentKeys = keysByList[listIndex];

        for (let index = 0; index < current.length; index++) {
            const key = currentKeys[index];
            if (addedKeys.has(key)) continue;

            let occurrences = 0;
            for (const set of sets) if (set.has(key)) occurrences++;

            if (occurrences === 1) {
                result.push(current[index]);
                addedKeys.add(key);
            }
        }
    }

    return result;
}
