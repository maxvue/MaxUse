import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um array com os valores de `array` que não estão presentes em
 * nenhum dos `values`, usando SameValueZero para comparação (com suporte a
 * `NaN`). Os `values` são achatados em 1 nível antes da comparação.
 * Semelhante ao _.difference do Lodash.
 *
 * @param array array de entrada
 * @param values arrays de valores a excluir
 * @returns novo array com a diferença
 */
export function difference<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: T[][]): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    const excluded = new Set<T>();
    for (const value of values) if (Array.isArray(value)) for (const item of value) excluded.add(item);

    return data.filter((item) => !excluded.has(item));
}
