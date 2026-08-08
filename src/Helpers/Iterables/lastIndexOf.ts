import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna o índice da última ocorrência de `value` no array, usando
 * comparação estrita (com suporte a `NaN`), buscando de trás para frente.
 * Semelhante ao _.lastIndexOf do Lodash.
 *
 * @param array array de entrada
 * @param value valor a procurar
 * @param fromIndex índice inicial da busca (de trás para frente); negativo
 * conta do fim
 * @returns índice encontrado, ou `-1`
 */
export function lastIndexOf<T>(
    array: MaybeRefOrGetter<T[] | null | undefined>,
    value: T,
    fromIndex?: number
): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return -1;

    let index = length - 1;
    if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
    }

    const isValueNaN = value !== value;
    for (; index >= 0; index--) {
        const item = data![index];
        if (item === value || (isValueNaN && item !== item)) return index;
    }

    return -1;
}
