import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseIsMatch } from './_baseIsMatch';

/**
 * Verifica se `object` corresponde parcialmente a `source`: para cada
 * propriedade de `source`, `object` precisa ter um valor equivalente
 * (comparação profunda). Propriedades extras em `object` são ignoradas.
 * Semelhante ao _.isMatch do Lodash.
 *
 * @param object valor a inspecionar
 * @param source valor com as chaves/valores exigidos
 * @returns `true` se `object` casar parcialmente com `source`
 */
export function isMatch(object: MaybeRefOrGetter<unknown>, source: MaybeRefOrGetter<unknown>): boolean {
    const obj = toValue(object);
    const src = toValue(source);
    return obj === src || baseIsMatch(obj, src);
}
