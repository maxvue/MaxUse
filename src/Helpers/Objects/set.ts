import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseSet } from './_baseSet';

/**
 * Define o valor em um caminho específico de um objeto.
 * Se o caminho não existir, ele será criado.
 * Semelhante ao _.set do Lodash.
 *
 * @param object O objeto a ser modificado.
 * @param path O caminho da propriedade a ser definida.
 * @param value O valor a ser definido.
 * @returns Retorna o objeto modificado.
 */
export function set<T>(
    object: MaybeRefOrGetter<T | null | undefined>,
    path: MaybeRefOrGetter<unknown>,
    value: unknown
): T | null | undefined {
    const data = toValue(object);
    if (data == null) return object as T | null | undefined;

    baseSet(data, toValue(path), value);
    return object as T | null | undefined;
}
