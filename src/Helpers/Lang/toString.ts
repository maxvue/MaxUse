import { toValue, type MaybeRefOrGetter } from 'vue';
import { baseToString } from './_baseToString';

/**
 * Converte um valor para string. `null`/`undefined` no nível mais externo
 * viram string vazia; `-0` é preservado como `'-0'` (diferente de
 * `String(-0)`, que dá `'0'`); arrays convertem cada elemento
 * recursivamente e juntam com vírgula.
 * Semelhante ao _.toString do Lodash.
 *
 * @param value valor a converter
 * @returns representação em string do valor
 */
export function toString(value: MaybeRefOrGetter<unknown>): string {
    const data = toValue(value);
    if (data === null || data === undefined) return '';
    return baseToString(data);
}
