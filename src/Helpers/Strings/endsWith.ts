import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { baseToString } from '../Lang/_baseToString';
import { toInteger } from '../Lang/toInteger';

/**
 * Verifica se `string` termina com `target`, considerando a string até a
 * posição `position` (exclusiva).
 * Semelhante ao _.endsWith do Lodash.
 *
 * @param string string a verificar
 * @param target substring esperada no fim
 * @param position posição final da busca (padrão: comprimento da string)
 * @returns `true` se `string` terminar com `target` até `position`
 */
export function endsWith(string: MaybeRefOrGetter<unknown>, target: MaybeRefOrGetter<unknown>, position?: MaybeRefOrGetter<number>): boolean {
    const str = toString(toValue(string));
    const length = str.length;
    const pos = position === undefined ? length : Math.min(Math.max(toInteger(toValue(position)), 0), length);
    const targetStr = baseToString(toValue(target));
    const end = pos;
    const start = pos - targetStr.length;
    return start >= 0 && str.slice(start, end) === targetStr;
}
