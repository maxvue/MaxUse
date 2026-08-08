import { toValue, type MaybeRefOrGetter } from 'vue';
import { toString } from '../Lang/toString';

const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
};
const reUnescapedHtml = /[&<>"']/g;

/**
 * Escapa os caracteres `&`, `<`, `>`, `"` e `'` de uma string para uso
 * seguro em HTML.
 * Semelhante ao _.escape do Lodash.
 *
 * @param value string a escapar
 * @returns string com os caracteres especiais de HTML escapados
 */
export function escape(value: MaybeRefOrGetter<unknown>): string {
    const str = toString(toValue(value));
    return str ? str.replace(reUnescapedHtml, (char) => htmlEscapes[char]) : str;
}
