import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Retorna todos os elementos do array, exceto o último.
 * Semelhante ao _.initial do Lodash.
 *
 * @param array array de entrada
 * @returns novo array sem o último elemento
 */
export function initial<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    return length ? data!.slice(0, length - 1) : [];
}
