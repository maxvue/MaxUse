import { toValue, type MaybeRefOrGetter } from 'vue';
import { toInteger } from '../Lang/toInteger';

const MAX_SAFE_INTEGER = 9007199254740991;
const MAX_ARRAY_LENGTH = 4294967295;

/**
 * Invoca `iteratee` `n` vezes, retornando um array com os resultados. Se
 * `iteratee` for omitido, retorna o índice de cada iteração (`0, 1, 2...`).
 * Semelhante ao _.times do Lodash.
 *
 * @param n número de vezes a invocar `iteratee`
 * @param iteratee função pura invocada com o índice de cada iteração
 * @returns array com os resultados de cada invocação
 */
export function times<T = number>(n: MaybeRefOrGetter<number>, iteratee?: (index: number) => T): T[] {
    const count = toInteger(toValue(n));
    if (count < 1 || count > MAX_SAFE_INTEGER) return [];

    const fn = iteratee || ((index: number) => index as unknown as T);
    const length = Math.min(count, MAX_ARRAY_LENGTH);
    const result: T[] = new Array(length);
    for (let i = 0; i < length; i++) result[i] = fn(i);
    // Além de MAX_ARRAY_LENGTH, o Lodash continua invocando `iteratee` sem
    // acumular no array (que não pode crescer além desse limite nativo).
    for (let i = MAX_ARRAY_LENGTH; i < count; i++) fn(i);
    return result;
}
