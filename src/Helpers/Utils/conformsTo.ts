import { toValue, type MaybeRefOrGetter } from 'vue';
import { keys } from '../Objects/keys';

/**
 * Verifica se `object` "conforma" com `source`: para cada chave de
 * `source` cujo valor é uma função, essa função precisa retornar valor
 * verdadeiro quando chamada com o valor correspondente de `object`.
 * `source` sem chaves (ou `null`/`undefined`) sempre conforma.
 * Semelhante ao _.conformsTo do Lodash.
 *
 * @param object objeto a verificar
 * @param source objeto com predicados por chave
 * @returns `true` se `object` conformar com todos os predicados de `source`
 */
export function conformsTo(object: MaybeRefOrGetter<unknown>, source: MaybeRefOrGetter<Record<PropertyKey, (value: unknown) => boolean> | null | undefined>): boolean {
    const src = toValue(source);
    if (src == null) return true;

    const data = toValue(object) as Record<PropertyKey, unknown> | null | undefined;
    const propsKeys = keys(src);

    for (const key of propsKeys) {
        const predicate = src[key];
        if (data == null || !predicate(data[key])) return false;
    }
    return true;
}
