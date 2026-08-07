import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from './toString';
import { baseToString } from './_baseToString';

// Reconhece segmentos de caminho: `.chave`, `[índice]`, `["chave com aspas"]`
// ou a chave inicial sem separador.
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;

/**
 * Converte uma string de caminho (ex.: `'a.b[0].c'`) em um array de
 * segmentos (ex.: `['a', 'b', '0', 'c']`). Se já for um array, converte
 * cada elemento para chave de string. `Symbol` é preservado como
 * elemento único do array.
 * Semelhante ao _.toPath do Lodash.
 *
 * @param value string de caminho, array de chaves, ou outro valor
 * @returns array de segmentos do caminho
 */
export function toPath(value: MaybeRefOrGetter<unknown>): Array<string | symbol> {
    const data = toValue(value);

    if (Array.isArray(data)) return data.map((item) => (typeof item === 'symbol' ? item : baseToString(item)));
    if (typeof data === 'symbol') return [data];

    const str = toString(data);
    const result: string[] = [];
    if (str.charCodeAt(0) === 46) result.push('');

    str.replace(rePropName, (match: string, num: string, quote: string, subStr: string) => {
        result.push(quote ? subStr.replace(reEscapeChar, '$1') : (num || match));
        return match;
    });

    return result;
}
