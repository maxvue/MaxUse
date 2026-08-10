import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';
import { parseBrNumber } from '../Strings/converters';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Formata um número para o padrão de moeda brasileira (R$).
 *
 * @param value O valor a ser formatado.
 */
export function formatCurrency(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return 'R$ 0,00';

    const num = parseBrNumber(data);
    if (isNaN(num)) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(num).replace(/[\u00a0\u202f]/g, ' ');
}

