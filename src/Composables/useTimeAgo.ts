import { UseTimeAgoReturn, useTimeAgo as vueUseTimeAgo, type UseTimeAgoMessages } from '@vueuse/core';
import { MaybeRefOrGetter, toValue } from 'vue';

type n = number;
type past = boolean;
type NumOrStr = number | string;

const ptBr: UseTimeAgoMessages = {
    justNow: 'agora',
    invalid: 'Data inválida',
    past: (n: NumOrStr) => (n.toString().match(/\d/) ? `${n}` : String(n)),
    future: (n: NumOrStr) => (n.toString().match(/\d/) ? `Em ${n}` : String(n)),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Mês passado' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? 'Semana passada' : 'Próxima semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoAbbrev: UseTimeAgoMessages = {
    justNow: 'Agora',
    invalid: 'Inválido',
    past: (n: NumOrStr) => (n.toString().match(/\d/) ? `${n}` : String(n)),
    future: (n: NumOrStr) => (n.toString().match(/\d/) ? `Em ${n}` : String(n)),
    month: (n: n, past: past) => (n === 1 ? (past ? '1 mês' : 'Próx. mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? '1 ano' : 'Próx. ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 Sem' : 'Próx. sem.') : `${n} sem.`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoAction: UseTimeAgoMessages = {
    justNow: 'Realizar Hoje',
    invalid: 'Data inválida',
    past: (n: NumOrStr) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : String(n)),
    future: (n: NumOrStr) => (n.toString().match(/\d/) ? `Realizar em ${n}` : String(n)),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (1 Mês)' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (Ontem)' : 'Realizar até amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoLimitAbbrev: UseTimeAgoMessages = {
    justNow: 'Hoje',
    invalid: 'Inválido',
    past: (n: NumOrStr) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : String(n)),
    future: (n: NumOrStr) => (n.toString().match(/\d/) ? `Em ${n}` : String(n)),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Mês passado' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoLimit = timeAgoAction;

export type TimeAgoFormat = 'br' | 'abbrev' | 'action' | 'limit' | 'limitAbbrev' | 'limit_abbrev' | 'future';

export const FORMAT_MAP: Record<TimeAgoFormat, UseTimeAgoMessages> = {
    br: ptBr,
    abbrev: timeAgoAbbrev,
    action: timeAgoAction,
    limit: timeAgoLimit,
    limitAbbrev: timeAgoLimitAbbrev,
    limit_abbrev: timeAgoLimitAbbrev,
    future: timeAgoLimitAbbrev
};

/**
 * Retorna uma string reativa indicando quanto tempo se passou desde uma data (ou falta para ela).
 * Wrapper do VueUse `useTimeAgo` com mensagens traduzidas para pt-BR e múltiplos formatos.
 *
 * Formatos disponíveis:
 * - `'br'` — Padrão completo em pt-BR ("Ontem", "2 dias", "Mês passado").
 * - `'abbrev'` — Abreviado ("1 Sem", "2h", "3m").
 * - `'action'` — Orientado a ação ("Realizar Hoje", "Atrasado: 2 dias").
 * - `'limit'` — Estilo de prazo (idêntico a action).
 * - `'limitAbbrev'` / `'limit_abbrev'` / `'future'` — Abreviado com estilo de prazo.
 *
 * @param initialDate - A data de referência (aceita Date, timestamp, string ISO ou valores reativos).
 * @param format - O formato das mensagens (padrão: 'br').
 * @returns Um objeto reativo `UseTimeAgoReturn` com a string formatada.
 *
 * @example
 * ```typescript
 * const tempoAtras = timeAgo('2026-05-20');
 * // tempoAtras.value → '4 dias'
 *
 * const prazo = timeAgo('2026-05-30', 'action');
 * // prazo.value → 'Realizar em 6 dias'
 * ```
 */
export const timeAgo = (
    initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>,
    format: TimeAgoFormat | (string & {}) = 'br'
): UseTimeAgoReturn => {
    // O fallback para null/undefined preserva reatividade; entradas inválidas (NaN) retornam a mensagem invalid.
    return vueUseTimeAgo(() => {
        const value = toValue(initialDate);
        if (value == null) return new Date();
        const d = value instanceof Date ? value : new Date(value);
        return isNaN(d.getTime()) ? (NaN as any) : (value as Date | number | string);
    }, { messages: FORMAT_MAP[format as TimeAgoFormat] ?? ptBr });
};

/** Alias de {@link timeAgo}. */
export const useTimeAgo = timeAgo;
