import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseGet } from './_baseGet';

/**
 * Cria uma função que retorna o valor no caminho que ela recebe,
 * consultado em `object`. É o inverso de `property`: aqui o objeto é
 * fixado na criação e o caminho varia a cada chamada.
 * Semelhante ao _.propertyOf do Lodash.
 *
 * @param object objeto a consultar
 * @returns função `(path) => valor no caminho`
 */
export function propertyOf(object: MaybeRefOrGetter<unknown>): (path: unknown) => unknown {
    const data = toValue(object);
    return (path: unknown) => (data == null ? undefined : baseGet(data, path));
}
