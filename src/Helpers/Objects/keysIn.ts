import { toValue, type MaybeRefOrGetter } from 'vue';
import { isArrayLike } from '../Lang/isArrayLike';

/**
 * Retorna as chaves enumeráveis de um objeto, incluindo as herdadas via
 * protótipo. Para valores array-like (arrays, strings, argumentos),
 * retorna os índices como strings.
 * Semelhante ao _.keysIn do Lodash.
 *
 * @param object objeto, array ou string
 * @returns array de chaves, próprias e herdadas
 */
export function keysIn(object: MaybeRefOrGetter<unknown>): string[] {
    const data = toValue(object);
    if (data == null) return [];

    if (isArrayLike(data)) {
        const length = (data as ArrayLike<unknown>).length;
        const result: string[] = [];
        for (let i = 0; i < length; i++) result.push(String(i));
        for (const key in data as object) if (!/^\d+$/.test(key) || Number(key) >= length) result.push(key);

        return result;
    }

    if (typeof data !== 'object' && typeof data !== 'function') return [];

    const result: string[] = [];
    for (const key in data as object) result.push(key);
    return result;
}
