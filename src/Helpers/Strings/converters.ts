import { toValue, type MaybeRefOrGetter } from 'vue';
import { isBlank } from '../Types/isBlank';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Converts a string or number into a normalized, accent-free, lowercase alphanumeric string (ideal for searches).
 *
 * @param value - The value or ref/getter to normalize.
 * @returns The normalized searchable string.
 */
export function toSearchableString(value: RefString): string {
    const data = toValue(value);
    if (!data || isBlank(data)) return '';

    return String(data).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

/**
 * Alias for {@link toSearchableString}.
 */
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
 * Converts a value into a number, with optional decimal rounding.
 * Supports both Brazilian ("1.234,56") and international ("1,234.56") number formats.
 *
 * @param value - The value or ref/getter to convert.
 * @param decimals - Optional number of decimal places to round to.
 * @returns Converted number, or 0 if conversion is not possible.
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

/**
 * Converts a numeric input or string containing pt-BR or international formatted values into a valid number.
 * Gracefully parses thousand separators ("1.234" -> 1234, "1.234,56" -> 1234.56, "R$ 1.234,56" -> 1234.56).
 * Returns NaN for invalid inputs or non-finite numbers.
 *
 * @param value - Input to parse.
 * @returns Parsed number or NaN.
 */
export function parseBrNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') return NaN;
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    if (typeof value !== 'string') return NaN;

    // Normaliza espaços em branco especiais (como NBSP)
    let str = value.replace(/[\u00a0\u202f]/g, ' ').trim();
    if (!str) return NaN;

    // Remove prefixo de moeda R$
    str = str.replace(/^R\$\s*/i, '').trim();

    // Remove sufixos de bytes (ex: Bytes, B, KB, etc.) no final
    str = str.replace(/\s*(bytes?|[bkmgtpezy]b?)?$/i, '').trim();
    if (!str) return NaN;

    const hasComma = str.includes(',');
    const hasDot = str.includes('.');

    if (hasComma && hasDot) {
        const isPtBr = str.lastIndexOf(',') > str.lastIndexOf('.');
        str = isPtBr ? str.replace(/\./g, '').replace(',', '.') : str.replace(/,/g, '');
    } else if (hasComma) str = str.replace(',', '.');
    else if (hasDot) {
        const isMilhar = /^[+-]?\d{1,3}(\.\d{3})+$/.test(str);
        if (isMilhar) str = str.replace(/\./g, '');
    }

    // Notação científica direta (ex: 2e3, -1.5e-2) ou decimal comum
    if (/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(str)) {
        const n = parseFloat(str);
        return Number.isFinite(n) ? n : NaN;
    }

    if (/[a-zA-Z]/.test(str)) return NaN;

    const num = Number(str);
    return Number.isFinite(num) ? num : NaN;
}


