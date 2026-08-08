import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um objeto a partir de um array de pares `[chave, valor]`.
 * Semelhante ao _.fromPairs do Lodash.
 *
 * @param pairs array de pares `[chave, valor]`
 * @returns objeto montado a partir dos pares
 */
export function fromPairs<V>(
    pairs: MaybeRefOrGetter<Array<[PropertyKey, V]> | null | undefined>
): Record<PropertyKey, V> {
    const data = toValue(pairs);
    const result: Record<PropertyKey, V> = {};
    const length = data == null ? 0 : data.length;

    for (let index = 0; index < length; index++) {
        const pair = data![index];
        result[pair[0]] = pair[1];
    }

    return result;
}
