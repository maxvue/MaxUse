import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Converte uma string ou número em uma string padronizada, sem acentos, sem caracteres especiais e em letras minúsculas (ideal para busca).
 *
 * @param value O valor a ser normalizado.
 * @returns A string normalizada.
 */
export function toSearchableString(value: RefString): string {
    const data = toValue(value);
    if (!data || isBlank(data)) return '';

    return String(data).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

export const normalizeToSearch = toSearchableString;

/**
 * Normaliza uma string numérica em formato pt-BR ("1.234,56") ou
 * internacional ("1,234.56") para o formato aceito por `Number()`.
 *
 * A distinção é feita pela posição do último separador: se a vírgula vier depois
 * do último ponto, ela é o separador decimal (pt-BR).
 */
function normalizeNumericString(raw: string): string {
    const str = raw.trim();
    const last_comma = str.lastIndexOf(',');
    const last_dot = str.lastIndexOf('.');

    // pt-BR: vírgula é o decimal, ponto é separador de milhar
    if (last_comma > last_dot) return str.replace(/\./g, '').replace(',', '.');

    // Internacional: ponto é o decimal, vírgula é separador de milhar
    return str.replace(/,/g, '');
}

/**
 * Converte um valor em um número, com a opção de arredondar para uma quantidade específica de casas decimais.
 * Aceita tanto o formato brasileiro ("1.234,56") quanto o internacional ("1,234.56").
 *
 * @param value O valor a ser convertido.
 * @param decimals Opcional. A quantidade de casas decimais.
 * @returns O número convertido ou arredondado. Retorna 0 se a conversão não for possível.
 */
export function toNumber(value: RefString, decimals: number | null = null): number {
    const data = toValue(value);
    if (isBlank(data, true)) return 0;

    const normalized = typeof data === 'string' ? normalizeNumericString(data) : data;
    const number = Number(normalized);

    if (isNaN(number)) return 0;

    if (decimals !== null) {
        const factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
    }
    return number;
}


