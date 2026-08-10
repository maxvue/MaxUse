import { toValue, type MaybeRefOrGetter } from 'vue';
import { parseBrNumber } from '../Strings/converters';

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
    const rawBytes = parseBrNumber(raw);
    const rawDecimals = toValue(decimals);

    if (isNaN(rawBytes) || rawBytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = rawDecimals < 0 ? 0 : rawDecimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const sign = rawBytes < 0 ? '-' : '';
    const abs = Math.abs(rawBytes);

    let i = Math.min(Math.max(Math.floor(Math.log(abs) / Math.log(k)), 0), sizes.length - 1);

    if (parseFloat((abs / Math.pow(k, i)).toFixed(dm)) >= k && i < sizes.length - 1) i++;

    return `${sign}${parseFloat((abs / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
