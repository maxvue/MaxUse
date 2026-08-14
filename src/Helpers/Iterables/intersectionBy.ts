import { iteratee } from '../Utils/iteratee';
import { splitRestIteratee } from './_restIteratee';

/**
 * Como `intersection`, mas aceita um `iteratee` (via `iteratee`) como
 * **último** argumento, usado para derivar o critério de comparação. Se o
 * último argumento não for um array, ele é tratado como o `iteratee`;
 * caso contrário, usa-se identidade. O resultado é escolhido a partir do
 * primeiro array.
 * Semelhante ao _.intersectionBy do Lodash.
 *
 * @param arrays arrays a interseccionar, seguidos opcionalmente do iteratee
 * @returns novo array com a interseção, por critério
 */
export function intersectionBy<T>(...arrays: unknown[]): T[] {
    const [lists, rawIteratee] = splitRestIteratee<T>(arrays);
    if (!lists.length) return [];

    const fn = iteratee(rawIteratee) as (value: T) => unknown;
    const [first, ...rest] = lists.map((list) => (Array.isArray(list) ? list : []));
    const restKeys = rest.map((list) => new Set(list.map((value) => fn(value))));

    const result: T[] = [];
    const seen = new Set<unknown>();

    for (const item of first) {
        const key = fn(item);
        if (seen.has(key)) continue;

        const inAll = restKeys.every((keys) => keys.has(key));
        if (inAll) {
            result.push(item);
            seen.add(key);
        }
    }

    return result;
}
