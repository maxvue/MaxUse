import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Junta os elementos do array em uma string, separados por `separator`.
 * Semelhante ao _.join do Lodash.
 *
 * @param array array de entrada
 * @param separator separador entre elementos (padrão `,`)
 * @returns string resultante, ou string vazia para `null`/`undefined`
 */
export function join<T>(array: MaybeRefOrGetter<T[] | null | undefined>, separator?: string): string {
    const data = toValue(array);
    return data == null ? '' : data.join(separator);
}
