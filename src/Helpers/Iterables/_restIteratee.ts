/**
 * Separa uma lista de argumentos "rest" (arrays a combinar, seguidos
 * opcionalmente de um `iteratee`) no par `[arrays, iterateeCru]`. Segue a
 * convenção do Lodash: se o **último** argumento não for array-like, ele é
 * tratado como o `iteratee` e removido da lista de arrays; caso contrário,
 * não há `iteratee` explícito (usa-se identidade).
 * Auxiliar interno compartilhado por `differenceBy`, `intersectionBy`,
 * `unionBy` e `xorBy`. Não é exportado no barrel da categoria.
 *
 * @param values lista de argumentos rest (arrays + iteratee opcional no final)
 * @returns tupla `[arrays, iterateeCru]`
 */
export function splitRestIteratee<T>(values: unknown[]): [T[][], unknown] {
    if (!values.length) return [[], undefined];

    const last = values[values.length - 1];
    if (Array.isArray(last)) return [values as T[][], undefined];

    return [values.slice(0, -1) as T[][], last];
}
