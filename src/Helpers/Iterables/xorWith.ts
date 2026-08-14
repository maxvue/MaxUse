import { splitRestIteratee } from './_restIteratee';

/**
 * Como `xor`, mas aceita um `comparator` como **último** argumento para
 * determinar a igualdade entre elementos, em vez de SameValueZero. Se o
 * último argumento não for um array, ele é tratado como o `comparator`.
 * Semelhante ao _.xorWith do Lodash.
 *
 * **Complexidade O(n*m)**: um comparador arbitrário não induz uma relação de
 * equivalência indexável, então não há como usar `Set` aqui. Para entradas
 * grandes, prefira `xorBy` quando o critério de igualdade puder ser expresso
 * como uma chave derivada.
 *
 * @param arrays arrays a comparar, seguidos opcionalmente do comparator
 * @returns novo array com a diferença simétrica, segundo o comparator
 */
export function xorWith<T>(...arrays: unknown[]): T[] {
    const [lists, rawComparator] = splitRestIteratee<T>(arrays);
    const comparator = (rawComparator as ((a: T, b: T) => boolean) | undefined) ?? ((a: T, b: T) => a === b || (a !== a && b !== b));
    const valid = lists.filter((list) => Array.isArray(list));

    const result: T[] = [];

    for (const current of valid) for (const item of current) {
        const occurrences = valid.filter((arr) => arr.some((value) => comparator(value, item))).length;
        const alreadyAdded = result.some((r) => comparator(r, item));
        if (occurrences === 1 && !alreadyAdded) result.push(item);
    }

    return result;
}
