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
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? 'Semana passada' : 'Próxima semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoAbbrev = {
    justNow: 'Agora',
    past: (n: n) => (n.toString().match(/\d/) ? `${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? '1 mês' : 'Próx. mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? '1 ano' : 'Próx. ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 Sem' : 'Próx. sem.') : `${n} sem.`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoAction = {
    justNow: 'Realizar Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Realizar em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (1 Mês)' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (Ontem)' : 'Realizar até amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoLimitAbbrev = {
    justNow: 'Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Mês passado' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Ontem' : 'Amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const timeAgoLimit = {
    justNow: 'Realizar Hoje',
    past: (n: n) => (n.toString().match(/\d/) ? `Atrasado: ${n}` : n),
    future: (n: n) => (n.toString().match(/\d/) ? `Realizar em ${n}` : n),
    month: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (1 Mês)' : 'Próximo mês') : `${n} M${n > 1 ? 'eses' : 'ês'}`),
    year: (n: n, past: past) => (n === 1 ? (past ? 'Ano passado' : 'Próximo ano') : `${n} ano${n > 1 ? 's' : ''}`),
    day: (n: n, past: past) => (n === 1 ? (past ? 'Atrasado (Ontem)' : 'Realizar até amanhã') : `${n} dia${n > 1 ? 's' : ''}`),
    week: (n: n, past: past) => (n === 1 ? (past ? '1 semana' : '1 semana') : `${n} semana${n > 1 ? 's' : ''}`),
    hour: (n: n) => `${n}h`,
    minute: (n: n) => `${n}m`,
    second: (n: n) => `${n}s`
};

const FORMAT_MAP: Record<string, any> = {
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
    // O fallback precisa ser resolvido dentro de um getter: passar `new Date()` direto
    // congelaria o valor e romperia a reatividade quando a data chegasse depois
    // (caso comum em carregamento assíncrono com valor inicial nulo).
    return vueUseTimeAgo(() => {
        const value = toValue(initialDate);
        return isNotValid(value) ? new Date() : value as Date | number | string;
    }, { messages: FORMAT_MAP[format] ?? ptBr });
};

/** Alias de {@link timeAgo}. */
export const useTimeAgo = timeAgo;
