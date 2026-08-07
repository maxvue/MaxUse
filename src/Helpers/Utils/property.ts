import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseGet } from './_baseGet';

/**
 * Cria uma função que retorna o valor no `path` do objeto que ela recebe.
 * O caminho é resolvido uma única vez, no momento da criação.
 * Semelhante ao _.property do Lodash.
 *
 * @param path caminho da propriedade (string, array ou símbolo)
 * @returns função `(object) => valor no caminho`
 */
export function property(path: MaybeRefOrGetter<unknown>): (object: unknown) => unknown {
    const key = toValue(path);
    return (object: unknown) => baseGet(object, key);
}
