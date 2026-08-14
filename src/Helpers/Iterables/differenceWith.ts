import { toValue, type MaybeRefOrGetter } from 'vue';
import { splitRestIteratee } from './_restIteratee';

/**
 * Como `difference`, mas aceita um `comparator` como **último** argumento
 * para determinar a igualdade entre elementos, em vez de SameValueZero. Se
 * o último argumento não for um array, ele é tratado como o `comparator`;
 * caso contrário, usa-se SameValueZero.
 * Semelhante ao _.differenceWith do Lodash.
 *
 * **Complexidade O(n*m)**: um comparador arbitrário não induz uma relação de
 * equivalência indexável, então não há como usar `Set` aqui. Para entradas
 * grandes, prefira `differenceBy` quando o critério de igualdade puder ser
 * expresso como uma chave derivada.
 *
 * @param array array de entrada
 * @param values arrays de valores a excluir, seguidos opcionalmente do comparator
 * @returns novo array com a diferença, segundo o comparator
 */
export function differenceWith<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: unknown[]): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const [arrays, rawComparator] = splitRestIteratee<T>(values);
    const comparator = (rawComparator as ((a: T, b: T) => boolean) | undefined) ?? ((a: T, b: T) => a === b || (a !== a && b !== b));

    const excluded: T[] = [];
    for (const value of arrays) if (Array.isArray(value)) excluded.push(...value);

    return data.filter((item) => !excluded.some((value) => comparator(item, value)));
}
