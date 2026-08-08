import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Remove os elementos do array nos índices especificados. **Muta** o
 * array de entrada e retorna os elementos removidos.
 * Semelhante ao _.pullAt do Lodash.
 *
 * @param array array a modificar (mutado in-place)
 * @param indexes índice (ou array de índices) a remover
 * @returns array com os elementos removidos, na ordem dos índices informados
 */
export function pullAt<T>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    indexes: number | number[]
): Array<T | undefined> {
    const data = toValue(array);
    const idxList = Array.isArray(indexes) ? indexes : [indexes];
    if (!data || !data.length) return idxList.map(() => undefined);

    const removed = idxList.map((index) => data[index]);

    const sortedUnique = Array.from(new Set(idxList.filter((i) => i >= 0 && i < data.length))).sort((a, b) => b - a);
    for (const index of sortedUnique) data.splice(index, 1);

    return removed;
}
