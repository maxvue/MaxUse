import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

/**
 * Converte o primeiro caractere de uma string para maiúsculas, mantendo o
 * restante intacto. Usa iteração por code point (`[...string]`), segura
 * para pares substitutos Unicode (ex.: emoji).
 * Semelhante ao _.upperFirst do Lodash.
 *
 * @param value string a converter
 * @returns string com o primeiro caractere em maiúsculas
 */
export function upperFirst(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    if (!str) return str;
    const [first, ...rest] = str;
    return first.toUpperCase() + rest.join('');
}
