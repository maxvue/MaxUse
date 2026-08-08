import { toValue, type MaybeRefOrGetter } from 'vue';
import { deepSet } from './_deepSet';

/**
 * Como `zipObject`, mas suporta caminhos profundos em `props` (ex.:
 * `'a.b'`, `'a[0].b'`), criando estruturas intermediárias — objetos ou
 * arrays, conforme o segmento seguinte do caminho seja um índice válido.
 * Semelhante ao _.zipObjectDeep do Lodash.
 *
 * @param props array de caminhos (string ou array de segmentos)
 * @param values array de valores
 * @returns objeto (possivelmente aninhado) montado a partir dos caminhos e valores
 */
export function zipObjectDeep(props: MaybeRefOrGetter<unknown[] | null | undefined>, values: MaybeRefOrGetter<unknown[] | null | undefined>): Record<PropertyKey, unknown> {
    const keys = toValue(props) || [];
    const vals = toValue(values) || [];
    const result: Record<PropertyKey, unknown> = {};

    for (let index = 0; index < keys.length; index++) deepSet(result, keys[index], vals[index]);

    return result;
}
