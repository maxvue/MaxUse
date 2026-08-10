/**
 * Helper interno para conversão e parsing seguro de datas.
 * Trata strings date-only ('YYYY-MM-DD') para prevenir o parse em UTC do JS
 * e interpreta como horário local.
 *
 * @param dateValue Valor de data (string, number, Date, null, undefined)
 * @returns Instância de Date válida ou null se inválida/falsy.
 */
export function _parseDate(dateValue: unknown): Date | null {
    if (dateValue === null || dateValue === undefined || dateValue === '') return null;

    if (dateValue instanceof Date) return isNaN(dateValue.getTime()) ? null : new Date(dateValue.getTime());


    if (typeof dateValue === 'string') {
        const trimmed = dateValue.trim();

        // Se for no formato date-only YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            const parts = trimmed.split('-').map(Number);
            const y = parts[0];
            const m = parts[1];
            const d = parts[2];
            const date = new Date(y, m - 1, d);
            return isNaN(date.getTime()) ? null : date;
        }

        const parsed = new Date(trimmed);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof dateValue === 'number') {
        const parsed = new Date(dateValue);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
}
