import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type TDateItem = string | number | Date | null | undefined;
type TDateArray = TDateItem[];
type Operator = 'and' | 'or';

/**
 * Verifica se as datas fornecidas são do mesmo dia.
 *
 * @param dates Array de datas.
 * @param operator Operador de comparação ('and' ou 'or').
 * @returns Retorna true conforme o operador.
 */
export function isSameDay(dates: MaybeRefOrGetter<TDateArray>, operator: Operator = 'or'): boolean {
    const values = toValue(dates);

    if (!values || values.length === 0) return true;
    if (values.length === 1) return _parseDate(values[0]) !== null;


    const parsedDates: Date[] = [];
    for (const val of values) {
        const d = _parseDate(val);
        if (!d) return false;
        parsedDates.push(d);
    }

    const days = parsedDates.map((d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);

    if (operator === 'and') return days.every((day) => day === days[0]);

    const uniqueDays = new Set(days);
    return uniqueDays.size < days.length;
}

