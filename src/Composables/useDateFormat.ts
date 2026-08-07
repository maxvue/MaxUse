import { isNotValid } from '../Helpers/Validations';
import { UseDateFormatReturn, useDateFormat as vueUseDateFormat } from '@vueuse/core';
import { MaybeRefOrGetter, toValue } from 'vue';

/**
 * Formata uma data usando um padrão de formato (wrapper do VueUse com fallback seguro).
 * Se a data for nula, undefined ou inválida, retorna a data atual formatada como fallback.
 *
 * @param initialDate - A data a ser formatada (aceita Date, timestamp, string ISO ou valores reativos).
 * @param format - O padrão de formatação (ex: 'DD/MM/YYYY', 'HH:mm:ss', 'YYYY-MM-DD HH:mm').
 * @returns Um objeto reativo `UseDateFormatReturn` contendo a string formatada.
 *
 * @example
 * ```typescript
 * const formatted = useDateFormat('2026-05-24', 'DD/MM/YYYY');
 * // formatted.value → '24/05/2026'
 *
 * const comHora = useDateFormat(new Date(), 'DD/MM/YYYY HH:mm');
 * // comHora.value → '24/05/2026 14:30'
 * ```
 */
export const useDateFormat = (initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>, format: string): UseDateFormatReturn => {
    // O fallback precisa ser resolvido dentro de um getter: passar `new Date()` direto
    // congelaria o valor e romperia a reatividade quando a data chegasse depois
    // (caso comum em carregamento assíncrono com valor inicial nulo).
    return vueUseDateFormat(() => {
        const value = toValue(initialDate);
        return isNotValid(value) ? new Date() : value as Date | number | string;
    }, format);
};

/** Alias de {@link useDateFormat}. */
export const dateFormat = useDateFormat;
