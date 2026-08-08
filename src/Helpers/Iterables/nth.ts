import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

/**
 * Retorna o elemento do array no índice `n`. Se `n` for negativo, o
 * elemento é retornado a partir do fim do array.
 * Semelhante ao _.nth do Lodash.
 *
 * @param array array de entrada
 * @param n índice do elemento (padrão `0`); negativo conta do fim
 * @returns elemento encontrado, ou `undefined`
 */
export function nth<T>(array: MaybeRefOrGetter<T[] | null | undefined>, n: number = 0): T | undefined {
    const data = toValue(array);
    if (!data || !data.length) return undefined;

    const index = toInteger(n);
    const resolved = index < 0 ? data.length + index : index;
    return resolved >= 0 && resolved < data.length ? data[resolved] : undefined;
}
