import { toValue, type MaybeRefOrGetter } from 'vue';
import { _parseDate } from './_parseDate';

type TDate = string | number | Date | null | undefined;

/**
 * Retorna true se a data informada cair em um sábado ou domingo.
 * Utilidade: Regras de negócio para cálculo de prazos, agendamentos e bloqueios de interface em dias não úteis.
 *
 * @param dateValue A data a ser verificada.
 * @returns Retorna true se a data cair em um sábado ou domingo.
 */
export function isWeekend(dateValue: MaybeRefOrGetter<TDate>): boolean {
    const rawValue = toValue(dateValue);
    const date = _parseDate(rawValue);

    if (!date) return false;

    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

