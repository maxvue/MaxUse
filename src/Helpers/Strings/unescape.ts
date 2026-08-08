import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': '\''
};
const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;

/**
 * Converte as entidades HTML `&amp;`, `&lt;`, `&gt;`, `&quot;` e `&#39;` de
 * volta aos caracteres correspondentes.
 * Semelhante ao _.unescape do Lodash.
 *
 * @param value string a desescapar
 * @returns string com as entidades HTML convertidas de volta
 */
export function unescape(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    return str ? str.replace(reEscapedHtml, (entity) => htmlUnescapes[entity]) : str;
}
