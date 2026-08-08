import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um array excluindo todos os `values` especificados, usando
 * SameValueZero para comparação (com suporte a `NaN`).
 * Semelhante ao _.without do Lodash.
 *
 * @param array array de entrada
 * @param values valores a excluir
 * @returns novo array sem os valores excluídos
 */
export function without<T>(array: MaybeRefOrGetter<T[] | null | undefined>, ...values: T[]): T[] {
    const data = toValue(array);
    if (!data || !data.length) return [];

    return data.filter((item) => !values.some((value) => item === value || (item !== item && value !== value)));
}
