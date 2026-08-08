import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Retorna todos os elementos do array, exceto o primeiro.
 * Semelhante ao _.tail do Lodash.
 *
 * @param array array de entrada
 * @returns novo array sem o primeiro elemento
 */
export function tail<T>(array: MaybeRefOrGetter<T[] | null | undefined>): T[] {
    const data = toValue(array);
    const length = data == null ? 0 : data.length;
    return length ? data!.slice(1, length) : [];
}
