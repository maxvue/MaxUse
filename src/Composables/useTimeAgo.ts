import { isNotValid, isValid } from '@/Helpers/Validations';
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

export const timeAgo = (initialDate: MaybeRefOrGetter<Date | number | string | undefined | null>, format: string = 'br'): UseTimeAgoReturn => {
    if (isNotValid(toValue(initialDate))) return vueUseTimeAgo(new Date(), { messages: FORMAT_MAP[format] ?? ptBr });
    return vueUseTimeAgo(initialDate as any, { messages: FORMAT_MAP[format] ?? ptBr });
};

export const useTimeAgo = timeAgo;
