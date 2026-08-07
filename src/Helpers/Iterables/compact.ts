import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um array com todos os elementos "falsy" removidos: `false`, `null`,
 * `0`, `''`, `undefined` e `NaN`.
 * Semelhante ao _.compact do Lodash.
 *
 * @param array array a filtrar
 * @returns novo array sem elementos falsy
 */
export function compact<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    const result: T[] = [];

    for (let index = 0; index < length; index++) {
        const value = data![index];
        if (value) result.push(value);
    }

    return result;
}
