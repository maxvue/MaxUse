import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Cria um objeto associando cada chave de `props` ao valor de mesmo índice
 * em `values`.
 * Semelhante ao _.zipObject do Lodash.
 *
 * @param props array de chaves
 * @param values array de valores
 * @returns objeto montado a partir das chaves e valores
 */
export function zipObject<V>(
    props: MaybeRefOrGetter<PropertyKey[] | null | undefined>,
    values: MaybeRefOrGetter<V[] | null | undefined>
): Record<PropertyKey, V | undefined> {
    const keys = toValue(props) || [];
    const vals = toValue(values) || [];
    const result: Record<PropertyKey, V | undefined> = {};

    for (let index = 0; index < keys.length; index++) result[keys[index]] = vals[index];

    return result;
}
