import { toValue, type MaybeRefOrGetter } from 'vue';
import { keysIn } from './keysIn';

/**
 * Itera sobre as propriedades próprias e herdadas de `object`, invocando
 * `iterateeFn` para cada uma. A iteração para antecipadamente se
 * `iterateeFn` retornar explicitamente `false`. Retorna o próprio
 * `object`.
 * Semelhante ao _.forIn do Lodash.
 *
 * @param object objeto a percorrer
 * @param iterateeFn função invocada para cada propriedade — `(value, key, object)`
 * @returns o próprio `object`
 */
export function forIn<T>(object: MaybeRefOrGetter<T>, iterateeFn: (value: unknown, key: string, object: T) => unknown): T {
    const data = toValue(object);
    if (data == null) return data;

    for (const key of keysIn(data)) if (iterateeFn((data as Record<string, unknown>)[key], key, data) === false) break;

    return data;
}
