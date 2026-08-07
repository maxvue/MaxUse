import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { baseToString } from '../Lang/_baseToString';
import { toInteger } from '../Lang/toInteger';

/**
 * Verifica se `string` começa com `target` a partir da posição `position`.
 * Semelhante ao _.startsWith do Lodash.
 *
 * @param string string a verificar
 * @param target substring esperada no início
 * @param position posição inicial da busca (padrão `0`)
 * @returns `true` se `string` começar com `target` a partir de `position`
 */
export function startsWith(string: MaybeRefOrGetter<unknown>, target: MaybeRefOrGetter<unknown>, position: MaybeRefOrGetter<number> = 0): boolean {
    const str = toString(toValue(string));
    const pos = position === undefined ? 0 : Math.min(Math.max(toInteger(toValue(position)), 0), str.length);
    const targetStr = baseToString(toValue(target));
    return str.slice(pos, pos + targetStr.length) === targetStr;
}
