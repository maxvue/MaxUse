import { isNotValid } from '../Helpers/Validations';
import { UseTimeAgoReturn, useTimeAgo as vueUseTimeAgo } from '@vueuse/core';
import { MaybeRefOrGetter, toValue } from 'vue';

type n = number;
type past = boolean;

const ptBr = {
    justNow: 'agora',
    past: (n: n) => (n.toString().match(/\d/) ? `${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Mês passado' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} year${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? 'Semana passada' : 'Próxima semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h${n > 1 ? 's' : ''}`,
    minute: (n: n) => `${n}m${n > 1 ? '' : ''}`,
    second: (n: n) => `${n}s${n > 1 ? 's' : ''}`
};

const timeAgoAbbrev = {
    justNow: 'Agora',
    past: (n: n) => (n.toString().match(/\d/) ? `${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? '1 mês' : 'Próx. mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? '1 ano' : 'Próx. ano') : `${n} year${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 Sem' : 'Próx. sem.') : `${n} sem.${n > 1 ? '' : ''}`),
    hour: (n: n) => `${n}h${n > 1 ? 's' : ''}`,
    minute: (n: n) => `${n}m${n > 1 ? 'm' : ''}`,
    second: (n: n) => `${n}s${n > 1 ? 's' : ''}`
};

const timeAgoAction = {
    justNow: 'Realizar Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Realizar em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (1 Mês)' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} year${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (Ontem)' : 'Realizar até amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h${n > 1 ? 's' : ''}`,
    minute: (n: n) => `${n}m${n > 1 ? '' : ''}`,
    second: (n: n) => `${n}s${n > 1 ? 's' : ''}`
};

const timeAgoLimitAbrev = {
    justNow: 'Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Mês passado' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} year${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h${n > 1 ? 's' : ''}`,
    minute: (n: n) => `${n}m${n > 1 ? '' : ''}`,
    second: (n: n) => `${n}s${n > 1 ? 's' : ''}`
};

const timeAgoLimit = {
    justNow: 'Realizar Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Realizar em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (1 Mês)' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} year${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (Ontem)' : 'Realizar até amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h${n > 1 ? 's' : ''}`,
    minute: (n: n) => `${n}m${n > 1 ? '' : ''}`,
    second: (n: n) => `${n}s${n > 1 ? 's' : ''}`
};

const FORMAT_MAP: Record<string, any> = {
    br: ptBr,
    abbrev: timeAgoAbbrev,
    action: timeAgoAction,
    limit: timeAgoLimit,
    limitAbbrev: timeAgoLimitAbrev,
    limit_abbrev: timeAgoLimitAbrev,
    future: timeAgoLimitAbrev
};

/**
 * Retorna uma string reativa indicando quanto tempo se passou desde uma data (ou falta para ela).
 * Wrapper do VueUse `useTimeAgo` com mensagens traduzidas para pt-BR e múltiplos formatos.
 *
 * Formatos disponíveis:
 * - `'br'` — Padrão completo em pt-BR ("Ontem", "2 dias", "Mês passado").
 * - `'abbrev'` — Abreviado ("1 Sem", "2h", "3m").
 * - `'action'` — Orientado a ação ("Realizar Hoje", "Atrasado: 2 dias").
 * - `'limit'` — Similar a action com estilo de prazo.
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
export const timeAgo = (initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>, format: string = 'br'): UseTimeAgoReturn => {
    if (isNotValid(toValue(initialDate))) return vueUseTimeAgo(new Date(), { messages: FORMAT_MAP[format] ?? ptBr });
    return vueUseTimeAgo(initialDate as any, { messages: FORMAT_MAP[format] ?? ptBr });
};

/** Alias de {@link timeAgo}. */
export const useTimeAgo = timeAgo;
