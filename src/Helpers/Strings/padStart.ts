import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';
import { toInteger } from '../Lang/toInteger';

/**
 * Constrói uma string de preenchimento com `chars` repetido até atingir
 * `length` caracteres. Conta por code point Unicode (não por unidade
 * UTF-16), para que caracteres astrais (emojis, etc.) contem como um único
 * caractere, igual ao Lodash.
 *
 * @param length comprimento desejado do preenchimento, em code points
 * @param chars caractere(s) de preenchimento (padrão: espaço)
 * @returns string de preenchimento
 */
function createPadding(length: number, chars = ' '): string {
    if (length < 1 || !chars) return '';
    const charsSymbols = [...chars];
    if (charsSymbols.length >= length) return charsSymbols.slice(0, length).join('');
    let result: string[] = [];
    let remaining = length;
    while (remaining > 0) {
        result = result.concat(charsSymbols);
        remaining -= charsSymbols.length;
    }
    return result.slice(0, length).join('');
}

/**
 * Preenche o início de uma string até que ela atinja `length` caracteres.
 * Semelhante ao _.padStart do Lodash.
 *
 * @param string string a preencher
 * @param length comprimento final desejado
 * @param chars caractere(s) de preenchimento (padrão: espaço)
 * @returns string preenchida no início
 */
export function padStart(string: MaybeRefOrGetter<unknown>, length?: MaybeRefOrGetter<number>, chars?: MaybeRefOrGetter<string>): string {
    const str = toString(toValue(string));
    const len = length === undefined ? 0 : toInteger(toValue(length));
    const strLength = len ? [...str].length : 0;
    if (!len || strLength >= len) return str;

    const charSet = chars === undefined ? undefined : toString(toValue(chars));
    return createPadding(len - strLength, charSet) + str;
}
