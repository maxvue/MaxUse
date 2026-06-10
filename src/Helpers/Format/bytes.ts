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
    const sanitized = typeof raw === 'string' ? raw.replace(/[^0-9.]/g, '') : raw;
    const rawBytes = Number(sanitized);
    const rawDecimals = toValue(decimals);

    if (isNaN(rawBytes) || rawBytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = rawDecimals < 0 ? 0 : rawDecimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(rawBytes) / Math.log(k));

    return `${parseFloat((rawBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
