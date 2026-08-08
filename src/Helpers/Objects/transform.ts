import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from './keys';

/**
 * Itera sobre `object` (array ou objeto), invocando `iterateeFn` com
 * `(accumulator, value, key, object)` para construir um novo valor
 * acumulado, ao invés de retornar um novo valor a cada passo (como
 * `reduce`). Se `accumulator` não for informado, um novo array (para
 * `object` array) ou objeto plano é criado automaticamente. A iteração
 * para antecipadamente se `iterateeFn` retornar explicitamente `false`.
 * Semelhante ao _.transform do Lodash.
 *
 * @param object array ou objeto a percorrer
 * @param iterateeFn função `(acc, value, key, object) => boolean | void`
 * @param accumulator acumulador inicial (opcional)
 * @returns o acumulador final
 */
export function transform<T, R = unknown>(
    object: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>,
    iterateeFn?: (acc: R, value: T, key: number | string, object: unknown) => unknown,
    accumulator?: R
): R {
    const data = toValue(object);
    const isArr = Array.isArray(data);
    const acc = (accumulator !== undefined ? accumulator : (isArr ? [] : {})) as R;

    if (data == null || !iterateeFn) return acc;

    if (isArr) {
        for (let index = 0; index < (data as T[]).length; index++) if (iterateeFn(acc, (data as T[])[index], index, data) === false) break;

        return acc;
    }

    for (const key of keys(data)) if (iterateeFn(acc, (data as Record<string, T>)[key], key, data) === false) break;

    return acc;
}
