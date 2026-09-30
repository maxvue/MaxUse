import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';
import { parseBrNumber } from '../Strings/converters';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Locale e opções do formatador de moeda.
 *
 * São constantes: `formatCurrency` não aceita locale nem opções por parâmetro,
 * portanto existe uma única configuração possível e a instância pode ser
 * compartilhada com segurança. Caso algum dia a função passe a receber opções
 * variáveis, este singleton precisa virar um cache com chave que cubra TODAS
 * as opções que afetam a saída (locale, currency, dígitos, etc.).
 */
const BRL_LOCALE = 'pt-BR';

const BRL_OPTIONS: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL'
};

/**
 * Instância única do `Intl.NumberFormat`, criada de forma preguiçosa.
 *
 * Construir um `Intl.NumberFormat` custa ~26 µs; reaproveitar a instância evita
 * milissegundos de main thread em listas grandes. A inicialização preguiçosa
 * mantém o módulo livre de efeito colateral no import (tree-shaking).
 */
let brlFormatter: Intl.NumberFormat | null = null;

function getBrlFormatter(): Intl.NumberFormat {
    if (!brlFormatter) brlFormatter = new Intl.NumberFormat(BRL_LOCALE, BRL_OPTIONS);

    return brlFormatter;
}

/**
 * Formats a numeric value or numeric string into Brazilian Real currency format ("R$ 1.250,50").
 * Handles null, undefined, empty values and reactive refs gracefully.
 *
 * @param value - The numeric value, string, or ref/getter to format.
 * @returns Formatted currency string in BRL.
 * @example
 * formatCurrency(1250.5) // "R$ 1.250,50"
 * formatCurrency('1250.50') // "R$ 1.250,50"
 * formatCurrency(null) // "R$ 0,00"
 */
export function formatCurrency(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return 'R$ 0,00';

    const num = parseBrNumber(data);
    if (isNaN(num)) return 'R$ 0,00';

    return getBrlFormatter().format(num).replace(/[\u00a0\u202f]/g, ' ');
}

