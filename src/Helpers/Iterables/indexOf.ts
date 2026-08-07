import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna o índice da primeira ocorrência de `value` no array, usando
 * comparação estrita (com suporte a `NaN`, ao contrário de
 * `Array#indexOf` nativo).
 * Semelhante ao _.indexOf do Lodash.
 *
 * @param array array de entrada
 * @param value valor a procurar
 * @param fromIndex índice inicial da busca; negativo conta do fim
 * @returns índice encontrado, ou `-1`
 */
export function indexOf<T>(array: MaybeRefOrGetter<T[] | null | undefined>, value: T, fromIndex?: number): number {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    if (!length) return -1;

    let index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) index = Math.max(length + index, 0);

    for (; index < length; index++) {
        const item = data![index];
        if (item === value || (item !== item && value !== value)) return index;
    }

    return -1;
}
