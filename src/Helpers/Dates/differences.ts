import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

function parseDate(value: RefDate): Date | null {
    const data = toValue(value);
    return _parseDate(data);
}

/**
 * Calculates absolute difference in seconds between two dates.
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in seconds.
 */
export function diffInSeconds(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;
    return Math.abs(Math.floor((d1.getTime() - d2.getTime()) / 1000));
}

/**
 * Calculates absolute difference in minutes between two dates.
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in minutes.
 */
export function diffInMinutes(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInSeconds(date1, date2) / 60));
}

/**
 * Calculates absolute difference in hours between two dates.
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in hours.
 */
export function diffInHours(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInMinutes(date1, date2) / 60));
}

/**
 * Calculates absolute difference in days between two dates.
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in days.
 */
export function diffInDays(date1: RefDate, date2: RefDate): number {
    return Math.abs(Math.floor(diffInHours(date1, date2) / 24));
}

/**
 * Calculates absolute difference in full calendar months between two dates.
 * Considers day of month (e.g. 31/01 to 01/02 returns 0).
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in full months.
 */
export function diffInMonths(date1: RefDate, date2: RefDate): number {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    if (!d1 || !d2) return 0;

    const [earlier, later] = d1 <= d2 ? [d1, d2] : [d2, d1];

    let months = (later.getFullYear() - earlier.getFullYear()) * 12
               + (later.getMonth() - earlier.getMonth());

    // Subtract incomplete month if day threshold was not reached
    const lastDayOfLaterMonth = new Date(later.getFullYear(), later.getMonth() + 1, 0).getDate();
    const anchorDay = Math.min(earlier.getDate(), lastDayOfLaterMonth);
    if (later.getDate() < anchorDay) months--;

    return Math.max(0, months);
}

/**
 * Calculates absolute difference in full calendar years between two dates.
 * Suitable for age calculations.
 *
 * @param date1 - First date (string, number, Date, or ref/getter).
 * @param date2 - Second date (string, number, Date, or ref/getter).
 * @returns Absolute difference in full years.
 */
export function diffInYears(date1: RefDate, date2: RefDate): number {
    return Math.floor(diffInMonths(date1, date2) / 12);
}
