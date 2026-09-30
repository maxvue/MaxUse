import { toValue, type MaybeRefOrGetter } from 'vue';
import { parseBrNumber } from '../Strings/converters';

/**
 * Converts a raw byte count into a human-readable formatted string (e.g. "1.5 MB").
 * Supports reactive refs or getters.
 *
 * @param bytes - The byte count as a number, string, or ref/getter.
 * @param decimals - The number of decimal places to include (default: 2).
 * @returns Human-readable formatted string.
 * @example
 * formatBytes(1048576) // "1 MB"
 * formatBytes(1536, 1) // "1.5 KB"
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
