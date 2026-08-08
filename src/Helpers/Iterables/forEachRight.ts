import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Itera sobre os elementos de `collection` (array ou objeto) na ordem
 * inversa, invocando `iterateeFn` para cada um. A iteração para
 * antecipadamente se `iterateeFn` retornar explicitamente `false`.
 * Retorna a própria `collection` (resolvida) para permitir encadeamento.
 * Semelhante ao _.forEachRight do Lodash.
 *
 * @param collection array ou objeto a percorrer
 * @param iterateeFn função invocada para cada elemento — `(value, key, collection)`
 * @returns a própria `collection`
 */
export function forEachRight<T>(collection: MaybeRefOrGetter<T[] | Record<string, T> | null | undefined>, iterateeFn: (value: T, key: number | string, collection: unknown) => unknown): T[] | Record<string, T> | null | undefined {
    const data = toValue(collection);
    if (data == null) return data;

    if (Array.isArray(data)) {
        for (let index = data.length - 1; index >= 0; index--) if (iterateeFn(data[index], index, data) === false) break;

        return data;
    }

    const keys = Object.keys(data);
    for (let index = keys.length - 1; index >= 0; index--) {
        const key = keys[index];
        if (iterateeFn((data as Record<string, T>)[key], key, data) === false) break;
    }
    return data;
}
