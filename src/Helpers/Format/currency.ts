import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';
import { toNumber } from '../Strings/converters';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Formata um número para o padrão de moeda brasileira (R$).
 *
 * @param value O valor a ser formatado.
 */
export function formatCurrency(value: RefString): string {
    const data = toValue(value);
    if (isBlank(data)) return 'R$ 0,00';

    if (typeof data === 'string') {
        const trimmed = data.trim();
        if (/[a-zA-Z]/.test(trimmed)) return 'R$ 0,00';
    }

    const num = toNumber(data);

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(num);
}

