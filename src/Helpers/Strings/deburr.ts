import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

// Letras latinas que não se decompõem via Unicode NFD (ligaduras e o "ß"
// alemão) — tratadas manualmente antes da normalização, igual ao Lodash.
const deburredLetters: Record<string, string> = {
    'Æ': 'Ae', 'Ð': 'D', 'Ø': 'O', 'Þ': 'Th', 'ß': 'ss',
    'æ': 'ae', 'ð': 'd', 'ø': 'o', 'þ': 'th',
    'Ā': 'A', 'ā': 'a', 'Ă': 'A', 'ă': 'a', 'Ą': 'A', 'ą': 'a',
    'Ć': 'C', 'ć': 'c', 'Ĉ': 'C', 'ĉ': 'c', 'Ċ': 'C', 'ċ': 'c',
    'Č': 'C', 'č': 'c', 'Ď': 'D', 'ď': 'd', 'Đ': 'D', 'đ': 'd',
    'Ē': 'E', 'ē': 'e', 'Ĕ': 'E', 'ĕ': 'e', 'Ė': 'E', 'ė': 'e',
    'Ę': 'E', 'ę': 'e', 'Ě': 'E', 'ě': 'e', 'Ĝ': 'G', 'ĝ': 'g',
    'Ğ': 'G', 'ğ': 'g', 'Ġ': 'G', 'ġ': 'g', 'Ģ': 'G', 'ģ': 'g',
    'Ĥ': 'H', 'ĥ': 'h', 'Ħ': 'H', 'ħ': 'h', 'Ĩ': 'I', 'ĩ': 'i',
    'Ī': 'I', 'ī': 'i', 'Ĭ': 'I', 'ĭ': 'i', 'Į': 'I', 'į': 'i',
    'İ': 'I', 'ı': 'i', 'Ĳ': 'IJ', 'ĳ': 'ij', 'Ĵ': 'J', 'ĵ': 'j',
    'Ķ': 'K', 'ķ': 'k', 'ĸ': 'k', 'Ĺ': 'L', 'ĺ': 'l', 'Ļ': 'L',
    'ļ': 'l', 'Ľ': 'L', 'ľ': 'l', 'Ŀ': 'L', 'ŀ': 'l', 'Ł': 'L',
    'ł': 'l', 'Ń': 'N', 'ń': 'n', 'Ņ': 'N', 'ņ': 'n', 'Ň': 'N',
    'ň': 'n', 'ŉ': 'n', 'Ŋ': 'N', 'ŋ': 'n', 'Ō': 'O', 'ō': 'o',
    'Ŏ': 'O', 'ŏ': 'o', 'Ő': 'O', 'ő': 'o', 'Œ': 'Oe', 'œ': 'oe',
    'Ŕ': 'R', 'ŕ': 'r', 'Ŗ': 'R', 'ŗ': 'r', 'Ř': 'R', 'ř': 'r',
    'Ś': 'S', 'ś': 's', 'Ŝ': 'S', 'ŝ': 's', 'Ş': 'S', 'ş': 's',
    'Š': 'S', 'š': 's', 'Ţ': 'T', 'ţ': 't', 'Ť': 'T', 'ť': 't',
    'Ŧ': 'T', 'ŧ': 't', 'Ũ': 'U', 'ũ': 'u', 'Ū': 'U', 'ū': 'u',
    'Ŭ': 'U', 'ŭ': 'u', 'Ů': 'U', 'ů': 'u', 'Ű': 'U', 'ű': 'u',
    'Ų': 'U', 'ų': 'u', 'Ŵ': 'W', 'ŵ': 'w', 'Ŷ': 'Y', 'ŷ': 'y',
    'Ÿ': 'Y', 'Ź': 'Z', 'ź': 'z', 'Ż': 'Z', 'ż': 'z', 'Ž': 'Z',
    'ž': 'z', 'ſ': 's'
};

const reLatin1 = /[\xc0-\xffĀ-ſ]/g;
const reComboMark = /[̀-ͯ]/g;

/**
 * Remove diacríticos (acentos) de uma string, convertendo caracteres
 * latinos acentuados/ligados (ex.: `é`, `ã`, `æ`, `ß`) para seus
 * equivalentes ASCII mais próximos.
 * Semelhante ao _.deburr do Lodash.
 *
 * @param value string a "desacentuar"
 * @returns string sem diacríticos
 */
export function deburr(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    return str
        .replace(reLatin1, (char) => deburredLetters[char] || char)
        .normalize('NFD')
        .replace(reComboMark, '');
}
