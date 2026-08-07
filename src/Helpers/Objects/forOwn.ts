import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Itera sobre as propriedades **próprias** enumeráveis de `object`,
 * invocando `iterateeFn` para cada uma. A iteração para antecipadamente
 * se `iterateeFn` retornar explicitamente `false`. Retorna o próprio
 * `object`.
 * Semelhante ao _.forOwn do Lodash.
 *
 * @param object objeto a percorrer
 * @param iterateeFn função invocada para cada propriedade — `(value, key, object)`
 * @returns o próprio `object`
 */
export function forOwn<T>(object: MaybeRefOrGetter<T>, iterateeFn: (value: unknown, key: string, object: T) => unknown): T {
    const data = toValue(object);
    if (data == null) return data;

    for (const key of keys(data)) if (iterateeFn((data as Record<string, unknown>)[key], key, data) === false) break;

    return data;
}
