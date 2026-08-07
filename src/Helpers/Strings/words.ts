import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
const reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

const rsComboMarksRange = '\\u0300-\\u036f';
const reComboHalfMarksRange = '\\ufe20-\\ufe2f';
const rsComboSymbolsRange = '\\u20d0-\\u20ff';
const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
const rsDingbatRange = '\\u2700-\\u27bf';
const rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff';
const rsMathOpRange = '\\xac\\xb1\\xd7\\xf7';
const rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf';
const rsPunctuationRange = '\\u2000-\\u206f';
const rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000';
const rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde';
const rsVarRange = '\\ufe0e\\ufe0f';
const rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
const rsAstralRange = '\\ud800-\\udfff';

const rsApos = '[\'’]';
const rsBreak = `[${rsBreakRange}]`;
const rsCombo = `[${rsComboRange}]`;
const rsDigits = '\\d+';
const rsDingbat = `[${rsDingbatRange}]`;
const rsLower = `[${rsLowerRange}]`;
const rsMisc = `[^${rsAstralRange}${rsBreakRange}${rsDigits}${rsDingbatRange}${rsLowerRange}${rsUpperRange}]`;
const rsFitz = '\\ud83c[\\udffb-\\udfff]';
const rsModifier = `(?:${rsCombo}|${rsFitz})`;
const rsNonAstral = `[^${rsAstralRange}]`;
const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
const rsUpper = `[${rsUpperRange}]`;
const rsZWJ = '\\u200d';

const rsMiscLower = `(?:${rsLower}|${rsMisc})`;
const rsMiscUpper = `(?:${rsUpper}|${rsMisc})`;
const rsOptContrLower = `(?:${rsApos}(?:d|ll|m|re|s|t|ve))?`;
const rsOptContrUpper = `(?:${rsApos}(?:D|LL|M|RE|S|T|VE))?`;
const reOptMod = `${rsModifier}?`;
const rsOptVar = `[${rsVarRange}]?`;
const rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join('|')})${rsOptVar}${reOptMod})*`;
const rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])';
const rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])';
const rsSeq = rsOptVar + reOptMod + rsOptJoin;
const rsEmoji = `(?:${[rsDingbat, rsRegional, rsSurrPair].join('|')})${rsSeq}`;

const reUnicodeWord = new RegExp([
    `${rsUpper}?${rsLower}+${rsOptContrLower}(?=${[rsBreak, rsUpper, '$'].join('|')})`,
    `${rsMiscUpper}+${rsOptContrUpper}(?=${[rsBreak, rsUpper + rsMiscLower, '$'].join('|')})`,
    `${rsUpper}?${rsMiscLower}+${rsOptContrLower}`,
    `${rsUpper}+${rsOptContrUpper}`,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
].join('|'), 'g');

/**
 * Divide uma string em um array de suas palavras, detectando transições de
 * `camelCase`/`PascalCase`, dígitos colados a letras e pontuação. Quando um
 * `pattern` é fornecido, usa-o diretamente via `String.match` em vez da
 * detecção automática.
 * Semelhante ao _.words do Lodash.
 *
 * @param string string a dividir em palavras
 * @param pattern expressão regular ou string customizada para o `match`
 * @returns array das palavras encontradas
 */
export function words(string: MaybeRefOrGetter<unknown>, pattern?: RegExp | string): string[] {
    const str = toString(toValue(string));
    if (pattern !== undefined) return str.match(pattern) || [];
    return reHasUnicodeWord.test(str) ? (str.match(reUnicodeWord) || []) : (str.match(reAsciiWord) || []);
}
