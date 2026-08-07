import { toValue, type MaybeRefOrGetter } from 'vue';
import { isArrayLike } from '../Lang/isArrayLike';

/**
 * Retorna as chaves próprias enumeráveis de um objeto. Para valores
 * array-like (arrays, strings, argumentos), retorna os índices como
 * strings.
 * Semelhante ao _.keys do Lodash.
 *
 * @param object objeto, array ou string
 * @returns array de chaves
 */
export function keys(object: MaybeRefOrGetter<unknown>): string[] {
    const data = toValue(object);
    if (data == null) return [];

    if (isArrayLike(data)) {
        const length = (data as ArrayLike<unknown>).length;
        const result: string[] = [];
        for (let i = 0; i < length; i++) result.push(String(i));
        return result;
    }

    if (typeof data !== 'object' && typeof data !== 'function') return [];

    return Object.keys(data as object);
}
