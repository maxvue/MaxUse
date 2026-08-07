import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Converte um número bruto de bytes em uma string legível.
 *
 * @param bytes A quantidade de bytes.
 * @param decimals O número de casas decimais.
 */
export function formatBytes(
    bytes: MaybeRefOrGetter<number | string>,
    decimals: MaybeRefOrGetter<number> = 2
): string {
    const raw = toValue(bytes);
    // Preserva o sinal e aceita vírgula como separador decimal (pt-BR)
    const sanitized = typeof raw === 'string' ? raw.replace(',', '.').replace(/[^0-9.-]/g, '') : raw;
    const rawBytes = Number(sanitized);
    const rawDecimals = toValue(decimals);

    if (isNaN(rawBytes) || rawBytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = rawDecimals < 0 ? 0 : rawDecimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const sign = rawBytes < 0 ? '-' : '';
    const abs = Math.abs(rawBytes);

    // Limita ao maior sufixo disponível para não indexar fora do array
    const i = Math.min(Math.floor(Math.log(abs) / Math.log(k)), sizes.length - 1);

    return `${sign}${parseFloat((abs / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
