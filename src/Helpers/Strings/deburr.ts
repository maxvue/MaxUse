import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

// Tabela de conversão letra-a-letra do Lodash (Latin-1 Supplement + Latin
// Extended-A). Diferente de um `.normalize('NFD')` genérico, é uma tabela
// fechada: caracteres fora dela (ex.: `ș`, `ț` do romeno, fora da faixa
// `Ā-ſ`) **não** são alterados, mesmo tendo forma acentuada.
const deburredLetters: Record<string, string> = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'Ç': 'C', 'ç': 'c',
    'Ð': 'D', 'ð': 'd',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'Ñ': 'N', 'ñ': 'n',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'Ý': 'Y', 'ý': 'y', 'ÿ': 'y',
    'Æ': 'Ae', 'æ': 'ae',
    'Þ': 'Th', 'þ': 'th',
    'ß': 'ss',
    'Ā': 'A', 'Ă': 'A', 'Ą': 'A',
    'ā': 'a', 'ă': 'a', 'ą': 'a',
    'Ć': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Č': 'C',
    'ć': 'c', 'ĉ': 'c', 'ċ': 'c', 'č': 'c',
    'Ď': 'D', 'Đ': 'D', 'ď': 'd', 'đ': 'd',
    'Ē': 'E', 'Ĕ': 'E', 'Ė': 'E', 'Ę': 'E', 'Ě': 'E',
    'ē': 'e', 'ĕ': 'e', 'ė': 'e', 'ę': 'e', 'ě': 'e',
    'Ĝ': 'G', 'Ğ': 'G', 'Ġ': 'G', 'Ģ': 'G',
    'ĝ': 'g', 'ğ': 'g', 'ġ': 'g', 'ģ': 'g',
    'Ĥ': 'H', 'Ħ': 'H', 'ĥ': 'h', 'ħ': 'h',
    'Ĩ': 'I', 'Ī': 'I', 'Ĭ': 'I', 'Į': 'I', 'İ': 'I',
    'ĩ': 'i', 'ī': 'i', 'ĭ': 'i', 'į': 'i', 'ı': 'i',
    'Ĵ': 'J', 'ĵ': 'j',
    'Ķ': 'K', 'ķ': 'k', 'ĸ': 'k',
    'Ĺ': 'L', 'Ļ': 'L', 'Ľ': 'L', 'Ŀ': 'L', 'Ł': 'L',
    'ĺ': 'l', 'ļ': 'l', 'ľ': 'l', 'ŀ': 'l', 'ł': 'l',
    'Ń': 'N', 'Ņ': 'N', 'Ň': 'N', 'Ŋ': 'N',
    'ń': 'n', 'ņ': 'n', 'ň': 'n', 'ŋ': 'n',
    'ŉ': '\'n',
    'Ō': 'O', 'Ŏ': 'O', 'Ő': 'O',
    'ō': 'o', 'ŏ': 'o', 'ő': 'o',
    'Œ': 'Oe', 'œ': 'oe',
    'Ŕ': 'R', 'Ŗ': 'R', 'Ř': 'R',
    'ŕ': 'r', 'ŗ': 'r', 'ř': 'r',
    'Ś': 'S', 'Ŝ': 'S', 'Ş': 'S', 'Š': 'S',
    'ś': 's', 'ŝ': 's', 'ş': 's', 'š': 's',
    'Ţ': 'T', 'Ť': 'T', 'Ŧ': 'T',
    'ţ': 't', 'ť': 't', 'ŧ': 't',
    'Ũ': 'U', 'Ū': 'U', 'Ŭ': 'U', 'Ů': 'U', 'Ű': 'U', 'Ų': 'U',
    'ũ': 'u', 'ū': 'u', 'ŭ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
    'Ŵ': 'W', 'ŵ': 'w',
    'Ŷ': 'Y', 'ŷ': 'y', 'Ÿ': 'Y',
    'Ź': 'Z', 'Ż': 'Z', 'Ž': 'Z',
    'ź': 'z', 'ż': 'z', 'ž': 'z',
    'Ĳ': 'IJ', 'ĳ': 'ij',
    'ſ': 's'
};

const reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xffĀ-ſ]/g;
const reComboMark = /[̀-ͯ︠-︯⃐-⃿]/g;

/**
 * Remove diacríticos (acentos) de uma string, convertendo caracteres
 * latinos acentuados/ligados (ex.: `é`, `ã`, `æ`, `ß`) para seus
 * equivalentes ASCII mais próximos, via tabela de conversão (não
 * `.normalize('NFD')`) — igual ao Lodash, inclusive na peculiaridade de
 * não alterar caracteres fora do Latin-1 Supplement / Latin Extended-A
 * (ex.: `ș`, `ț` do romeno permanecem intocados).
 * Semelhante ao _.deburr do Lodash.
 *
 * @param value string a "desacentuar"
 * @returns string sem diacríticos
 */
export function deburr(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    if (!str) return str;
    return str
        .replace(reLatin, (char) => deburredLetters[char] || char)
        .replace(reComboMark, '');
}
