import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseIsMatch } from '../Lang/_baseIsMatch';
import { deepClone } from '../Objects/deepClone';

/**
 * Cria uma função que verifica se o objeto recebido casa parcialmente com
 * `source` (comparação profunda, por SameValueZero). `source` é clonado
 * profundamente no momento da criação — mudanças posteriores em `source`
 * não afetam a função retornada.
 * Semelhante ao _.matches do Lodash.
 *
 * @param source objeto com as chaves/valores exigidos
 * @returns função `(object) => boolean`
 */
export function matches(source: MaybeRefOrGetter<unknown>): (object: unknown) => boolean {
    const src = deepClone(toValue(source));
    return (object: unknown) => object === src || baseIsMatch(object, src);
}
