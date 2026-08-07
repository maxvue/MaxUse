import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Como `forIn`, mas percorre as propriedades na ordem inversa (`keysIn`
 * invertida).
 * Semelhante ao _.forInRight do Lodash.
 *
 * @param object objeto a percorrer
 * @param iterateeFn função invocada para cada propriedade — `(value, key, object)`
 * @returns o próprio `object`
 */
export function forInRight<T>(object: MaybeRefOrGetter<T>, iterateeFn: (value: unknown, key: string, object: T) => unknown): T {
    const data = toValue(object);
    if (data == null) return data;

    const objKeys = keysIn(data);
    for (let index = objKeys.length - 1; index >= 0; index--) {
        const key = objKeys[index];
        if (iterateeFn((data as Record<string, unknown>)[key], key, data) === false) break;
    }
    return data;
}
