import { splitRestIteratee } from './_restIteratee';

/**
 * Como `union`, mas aceita um `comparator` como **último** argumento para
 * determinar a igualdade entre elementos, em vez de SameValueZero. Se o
 * último argumento não for um array, ele é tratado como o `comparator`.
 * Semelhante ao _.unionWith do Lodash.
 *
 * @param arrays arrays a unir, seguidos opcionalmente do comparator
 * @returns novo array com a união, sem duplicatas segundo o comparator
 */
export function unionWith<T>(...arrays: unknown[]): T[] {
    const [lists, rawComparator] = splitRestIteratee<T>(arrays);
    const comparator = (rawComparator as ((a: T, b: T) => boolean) | undefined) ?? ((a: T, b: T) => a === b || (a !== a && b !== b));

    const flat = lists.filter((list) => Array.isArray(list)).flat(1) as T[];
    const result: T[] = [];

    for (const item of flat) if (!result.some((r) => comparator(r, item))) result.push(item);

    return result;
}
