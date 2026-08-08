import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Como `forOwn`, mas percorre as propriedades próprias na ordem inversa
 * (`keys` invertida).
 * Semelhante ao _.forOwnRight do Lodash.
 *
 * @param object objeto a percorrer
 * @param iterateeFn função invocada para cada propriedade — `(value, key, object)`
 * @returns o próprio `object`
 */
export function forOwnRight<T>(object: MaybeRefOrGetter<T>, iterateeFn: (value: unknown, key: string, object: T) => unknown): T {
    const data = toValue(object);
    if (data == null) return data;

    const objKeys = keys(data);
    for (let index = objKeys.length - 1; index >= 0; index--) {
        const key = objKeys[index];
        if (iterateeFn((data as Record<string, unknown>)[key], key, data) === false) break;
    }
    return data;
}
