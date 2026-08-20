import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type RefDate = MaybeRefOrGetter<string | number | Date | null | undefined>;

/**
 * Formata uma data no padrão textual abreviado de e-mails/mensagens:
 * - Menos de 1h: "X min" (ex: "3 min")
 * - Hoje (>= 1h): "HH:mm" (ex: "10:22")
 * - Ontem: "Ontem HH:mm" (ex: "Ontem 10:22")
 * - Menos de 1 semana (< 7 dias): "X dias" (ex: "3 dias")
 * - Menos de 1 mês (< 30 dias): "X Semanas" (ex: "2 Semanas", "1 Semana")
 * - Menos de 1 ano (< 365 dias): "X Mêses" (ex: "2 Mêses", "1 Mês")
 * - Mais de 1 ano (>= 365 dias): "X Anos" (ex: "2 Anos", "1 Ano")
 *
 * @param value A data a ser formatada.
 */
export function formatMailDate(value: RefDate): string {
    const data = toValue(value);
    const date = _parseDate(data);
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Se a data for no futuro ou com pequeno desvio de relógio
    if (diffMs < 0) {
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 60) {
        const mins = Math.max(1, diffMinutes);
        return `${mins} min`;
    }

    // Mesmo dia (Hoje)
    const isToday = date.getFullYear() === now.getFullYear() &&
                    date.getMonth() === now.getMonth() &&
                    date.getDate() === now.getDate();

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `${hh}:${mm}`;

    if (isToday) {
        return timeStr;
    }

    // Ontem
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const isYesterday = date.getFullYear() === yesterday.getFullYear() &&
                        date.getMonth() === yesterday.getMonth() &&
                        date.getDate() === yesterday.getDate();

    if (isYesterday) {
        return `Ontem ${timeStr}`;
    }

    // Dias
    const oneDayMs = 86400000;
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const calendarDays = Math.max(1, Math.round((startOfNow - startOfDate) / oneDayMs));

    // Menos de 1 semana (< 7 dias)
    if (calendarDays < 7) {
        return `${calendarDays} dias`;
    }

    // Menos de 1 mês (< 30 dias)
    if (calendarDays < 30) {
        const weeks = Math.max(1, Math.floor(calendarDays / 7));
        return weeks === 1 ? '1 Semana' : `${weeks} Semanas`;
    }

    // Menos de 1 ano (< 365 dias)
    if (calendarDays < 365) {
        const months = Math.max(1, (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth()) || Math.floor(calendarDays / 30));
        return months === 1 ? '1 Mês' : `${months} Mêses`;
    }

    // Mais de 1 ano
    const years = Math.max(1, now.getFullYear() - date.getFullYear() || Math.floor(calendarDays / 365));
    return years === 1 ? '1 Ano' : `${years} Anos`;
}
