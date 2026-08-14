import { splitRestIteratee } from './_restIteratee';

/**
 * Como `intersection`, mas aceita um `comparator` como **último** argumento
 * para determinar a igualdade entre elementos, em vez de SameValueZero. Se
 * o último argumento não for um array, ele é tratado como o `comparator`.
 * Semelhante ao _.intersectionWith do Lodash.
 *
 * **Complexidade O(n*m)**: um comparador arbitrário não induz uma relação de
 * equivalência indexável, então não há como usar `Set` aqui. Para entradas
 * grandes, prefira `intersectionBy` quando o critério de igualdade puder ser
 * expresso como uma chave derivada.
 *
 * @param arrays arrays a interseccionar, seguidos opcionalmente do comparator
 * @returns novo array com a interseção, segundo o comparator
 */
export function intersectionWith<T>(...arrays: unknown[]): T[] {
    const [lists, rawComparator] = splitRestIteratee<T>(arrays);
    if (!lists.length) return [];

    const comparator = (rawComparator as ((a: T, b: T) => boolean) | undefined) ?? ((a: T, b: T) => a === b || (a !== a && b !== b));
    const [first, ...rest] = lists.map((list) => (Array.isArray(list) ? list : []));

    const result: T[] = [];
    for (const item of first) {
        if (result.some((r) => comparator(r, item))) continue;
        const inAll = rest.every((list) => list.some((value) => comparator(value, item)));
        if (inAll) result.push(item);
    }

    return result;
}
