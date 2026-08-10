import { toValue, type MaybeRefOrGetter } from 'vue';

type RefString = MaybeRefOrGetter<string | number | null | undefined>;

/**
 * Verifica se um valor é uma data válida.
 * Suporta instâncias de Date, timestamps numéricos, strings no padrão ISO e formato brasileiro (DD/MM/YYYY).
 *
 * @param valor O valor a ser verificado.
 * @returns Retorna true se for uma data válida.
 */
export function isDate(valor: RefString): boolean {
    const data: any = toValue(valor);
    if (data instanceof Date) return !isNaN(data.getTime());

    if (typeof data === 'string') {
        const str = data.trim();
        // Checagem para formato brasileiro DD/MM/YYYY [HH:mm[:ss]]
        const brMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
        if (brMatch) {
            const day = Number(brMatch[1]);
            const month = Number(brMatch[2]) - 1;
            const year = Number(brMatch[3]);
            const hour = Number(brMatch[4] ?? 0);
            const min = Number(brMatch[5] ?? 0);
            const sec = Number(brMatch[6] ?? 0);

            const d = new Date(year, month, day, hour, min, sec);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        }

        const parsed = new Date(str);
        return !isNaN(parsed.getTime());
    }

    if (typeof data === 'number') {
        const parsed = new Date(data);
        return !isNaN(parsed.getTime());
    }

    return false;
}
