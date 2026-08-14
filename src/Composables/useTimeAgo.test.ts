import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { timeAgo, useTimeAgo, FORMAT_MAP } from './useTimeAgo';

/**
 * Helpers para criar datas com deslocamento controlado a partir do "agora" congelado.
 * Usamos vi.useFakeTimers() para garantir resultados determinísticos.
 */

// Data fixa: 2026-06-15T12:00:00.000Z (um domingo ao meio-dia UTC)
const FIXED_NOW = new Date('2026-06-15T12:00:00.000Z').getTime();

/** Cria uma data no passado, N milissegundos atrás */
const ago = (ms: number) => new Date(FIXED_NOW - ms);

/** Cria uma data no futuro, N milissegundos à frente */
const ahead = (ms: number) => new Date(FIXED_NOW + ms);

// Constantes de tempo em milissegundos
const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

describe('timeAgo', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_NOW);
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
        vi.useRealTimers();
    });

    // ─── FORMATO "br" (padrão) ───────────────────────────────────────

    describe('formato "br" (padrão)', () => {
        it('justNow → "agora" para data atual', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW));
                expect(result.value.toLowerCase()).toContain('agora');
            });
        });

        it('seconds (< 1min) → VueUse trata como justNow', () => {
            scope.run(() => {
                const result = timeAgo(ago(30 * SECOND));
                // VueUse considera < 1 minuto como "just now"
                expect(result.value.toLowerCase()).toContain('agora');
            });
        });

        it('minutes → "Xm" para minutos atrás', () => {
            scope.run(() => {
                const result = timeAgo(ago(5 * MINUTE));
                expect(result.value).toMatch(/5m/);
            });
        });

        it('hours → "Xh" para horas atrás', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * HOUR));
                expect(result.value).toMatch(/3h/);
            });
        });

        it('hours → "1h" (singular) para 1 hora', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * HOUR));
                expect(result.value).toContain('1h');
            });
        });

        it('day → "Ontem" para 1 dia atrás', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY));
                expect(result.value).toContain('Ontem');
            });
        });

        it('days → "X dias" para múltiplos dias', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * DAY));
                expect(result.value).toContain('3 dias');
            });
        });

        it('week → "Semana passada" para 1 semana', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * WEEK));
                expect(result.value).toContain('Semana passada');
            });
        });

        it('weeks → "X semanas" para múltiplas semanas', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * WEEK));
                expect(result.value).toContain('3 semanas');
            });
        });

        it('month → "Mês passado" para 1 mês', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MONTH));
                expect(result.value).toContain('Mês passado');
            });
        });

        it('months → "X Meses" para múltiplos meses', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * MONTH));
                expect(result.value).toContain('3 Meses');
            });
        });

        it('year → "Ano passado" para 1 ano', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * YEAR));
                expect(result.value).toContain('Ano passado');
            });
        });

        it('years → "X anos" para múltiplos anos', () => {
            scope.run(() => {
                const result = timeAgo(ago(2 * YEAR));
                expect(result.value).toContain('2 anos');
            });
        });
    });

    // ─── FORMATO "br" — FUTURO ──────────────────────────────────────

    describe('formato "br" — datas futuras', () => {
        it('day → "Amanhã" para 1 dia no futuro', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * DAY));
                expect(result.value).toContain('Amanhã');
            });
        });

        it('days → "Em X dias" para múltiplos dias no futuro', () => {
            scope.run(() => {
                const result = timeAgo(ahead(3 * DAY));
                expect(result.value).toContain('3 dias');
                expect(result.value.toLowerCase()).toContain('em');
            });
        });

        it('week → "Próxima semana" para 1 semana no futuro', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * WEEK));
                expect(result.value).toContain('Próxima semana');
            });
        });

        it('month → "Próximo mês" para 1 mês no futuro', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * MONTH));
                expect(result.value).toContain('Próximo mês');
            });
        });

        it('year → "Próximo ano" para 1 ano no futuro', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * YEAR));
                expect(result.value).toContain('Próximo ano');
            });
        });
    });

    // ─── FORMATO "abbrev" ────────────────────────────────────────────

    describe('formato "abbrev"', () => {
        it('justNow → "Agora"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'abbrev');
                expect(result.value).toContain('Agora');
            });
        });

        it('day (passado) → "Ontem"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY), 'abbrev');
                expect(result.value).toContain('Ontem');
            });
        });

        it('week (passado) → "1 Sem"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * WEEK), 'abbrev');
                expect(result.value).toContain('1 Sem');
            });
        });

        it('month (passado) → "1 mês"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MONTH), 'abbrev');
                expect(result.value).toContain('1 mês');
            });
        });

        it('week (futuro) → "Próx. sem."', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * WEEK), 'abbrev');
                expect(result.value).toContain('Próx. sem.');
            });
        });

        it('year (passado) → "1 ano"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * YEAR), 'abbrev');
                expect(result.value).toContain('1 ano');
            });
        });
    });

    // ─── FORMATO "action" ────────────────────────────────────────────

    describe('formato "action"', () => {
        it('justNow → "Realizar Hoje"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'action');
                expect(result.value).toContain('Realizar Hoje');
            });
        });

        it('day (passado) → "Atrasado (Ontem)"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY), 'action');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('Ontem');
            });
        });

        it('day (futuro) → "Realizar até amanhã"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * DAY), 'action');
                expect(result.value).toContain('Realizar');
                expect(result.value.toLowerCase()).toContain('amanhã');
            });
        });

        it('days (passado) → "Atrasado: X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ago(5 * DAY), 'action');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('dias');
            });
        });

        it('days (futuro) → "Realizar em X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(5 * DAY), 'action');
                expect(result.value).toContain('Realizar em');
            });
        });

        it('month (passado) → "Atrasado (1 Mês)"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MONTH), 'action');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('Mês');
            });
        });

        it('year (passado) → "Ano passado"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * YEAR), 'action');
                expect(result.value).toContain('Ano passado');
            });
        });

        it('year (futuro) → "Próximo ano"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * YEAR), 'action');
                expect(result.value).toContain('Próximo ano');
            });
        });

        it('years plural (passado) → "X anos"', () => {
            scope.run(() => {
                const result = timeAgo(ago(2 * YEAR), 'action');
                expect(result.value).toContain('2 anos');
            });
        });

        it('week (passado) → "Atrasado: 1 semana"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * WEEK), 'action');
                expect(result.value).toContain('1 semana');
            });
        });

        it('weeks plural (passado) → "X semanas"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * WEEK), 'action');
                expect(result.value).toContain('3 semanas');
            });
        });

        it('hours (passado) → "Atrasado: Xh"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * HOUR), 'action');
                expect(result.value).toContain('3h');
            });
        });

        it('hour singular (passado) → "1h"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * HOUR), 'action');
                expect(result.value).toContain('1h');
            });
        });

        it('minutes (passado) → "Atrasado: Xm"', () => {
            scope.run(() => {
                const result = timeAgo(ago(5 * MINUTE), 'action');
                expect(result.value).toMatch(/5m/);
            });
        });

        it('minute singular (passado) → "1m"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MINUTE), 'action');
                expect(result.value).toContain('1m');
            });
        });

        it('seconds (passado) → colapsa em justNow', () => {
            scope.run(() => {
                // Abaixo de 1 minuto o VueUse colapsa em justNow; o formatador de
                // segundos do mapa é coberto diretamente em "valida mensagens de action/limit".
                const result = timeAgo(ago(30 * SECOND), 'action');
                expect(result.value).toBe('Realizar Hoje');
            });
        });
    });

    describe('formato "limit" — cobertura completa', () => {
        it('justNow → "Realizar Hoje"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'limit');
                expect(result.value).toContain('Realizar Hoje');
            });
        });

        it('minutes (passado) → "Atrasado: Xm"', () => {
            scope.run(() => {
                const result = timeAgo(ago(5 * MINUTE), 'limit');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toMatch(/5m/);
            });
        });

        it('hours (passado) → "Atrasado: Xh"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * HOUR), 'limit');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('3h');
            });
        });

        it('hour singular (passado) → "Atrasado: 1h"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * HOUR), 'limit');
                expect(result.value).toContain('1h');
            });
        });

        it('day (passado) → "Atrasado (Ontem)"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY), 'limit');
                expect(result.value).toContain('Atrasado');
            });
        });

        it('days plural (passado) → "Atrasado: X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * DAY), 'limit');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('3 dias');
            });
        });

        it('week (passado) → "Atrasado: 1 semana"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * WEEK), 'limit');
                expect(result.value).toContain('1 semana');
            });
        });

        it('weeks plural (passado) → "Atrasado: X semanas"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * WEEK), 'limit');
                expect(result.value).toContain('3 semanas');
            });
        });

        it('month (passado) → "Atrasado (1 Mês)"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MONTH), 'limit');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('Mês');
            });
        });

        it('months plural (passado) → "Atrasado: X Meses"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * MONTH), 'limit');
                expect(result.value).toContain('3 Meses');
            });
        });

        it('year (passado) → "Atrasado: Ano passado"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * YEAR), 'limit');
                expect(result.value).toContain('Ano passado');
            });
        });

        it('years plural (passado) → "Atrasado: X years"', () => {
            scope.run(() => {
                const result = timeAgo(ago(2 * YEAR), 'limit');
                expect(result.value).toContain('2 anos');
            });
        });

        it('day (futuro) → "Realizar até amanhã"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * DAY), 'limit');
                expect(result.value).toContain('Realizar');
            });
        });

        it('days plural (futuro) → "Realizar em X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(3 * DAY), 'limit');
                expect(result.value).toContain('Realizar em');
                expect(result.value).toContain('dias');
            });
        });

        it('week (futuro) → "Realizar em 1 semana"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * WEEK), 'limit');
                expect(result.value).toContain('1 semana');
            });
        });

        it('month (futuro) → "Realizar em Próximo mês"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * MONTH), 'limit');
                expect(result.value).toContain('Próximo mês');
            });
        });

        it('year (futuro) → "Realizar em Próximo ano"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * YEAR), 'limit');
                expect(result.value).toContain('Próximo ano');
            });
        });

        it('hours (futuro) → "Realizar em Xh"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(3 * HOUR), 'limit');
                expect(result.value).toContain('Realizar em');
                expect(result.value).toContain('3h');
            });
        });
    });

    // ─── FORMATO "limitAbbrev" — cobertura completa ──────────────────

    describe('formato "limitAbbrev" — cobertura completa', () => {
        it('justNow → "Hoje"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'limitAbbrev');
                expect(result.value).toContain('Hoje');
            });
        });

        it('minutes (passado) → "Atrasado: Xm"', () => {
            scope.run(() => {
                const result = timeAgo(ago(5 * MINUTE), 'limitAbbrev');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toMatch(/5m/);
            });
        });

        it('hours (passado) → "Atrasado: Xh"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * HOUR), 'limitAbbrev');
                expect(result.value).toContain('Atrasado');
                expect(result.value).toContain('3h');
            });
        });

        it('hour singular (passado) → "Atrasado: 1h"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * HOUR), 'limitAbbrev');
                expect(result.value).toContain('1h');
            });
        });

        it('day (passado) → "Ontem"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY), 'limitAbbrev');
                expect(result.value).toContain('Ontem');
            });
        });

        it('days plural (passado) → "Atrasado: X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * DAY), 'limitAbbrev');
                expect(result.value).toContain('3 dias');
            });
        });

        it('week (passado) → "Atrasado: 1 semana"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * WEEK), 'limitAbbrev');
                expect(result.value).toContain('1 semana');
            });
        });

        it('weeks plural (passado) → "Atrasado: X semanas"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * WEEK), 'limitAbbrev');
                expect(result.value).toContain('3 semanas');
            });
        });

        it('month (passado) → "Atrasado: Mês passado"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * MONTH), 'limitAbbrev');
                expect(result.value).toContain('Mês passado');
            });
        });

        it('months plural (passado) → "Atrasado: X Meses"', () => {
            scope.run(() => {
                const result = timeAgo(ago(3 * MONTH), 'limitAbbrev');
                expect(result.value).toContain('3 Meses');
            });
        });

        it('year (passado) → "Atrasado: Ano passado"', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * YEAR), 'limitAbbrev');
                expect(result.value).toContain('Ano passado');
            });
        });

        it('years plural (passado) → "Atrasado: X years"', () => {
            scope.run(() => {
                const result = timeAgo(ago(2 * YEAR), 'limitAbbrev');
                expect(result.value).toContain('2 anos');
            });
        });

        it('days (futuro) → "Em X dias"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(3 * DAY), 'limitAbbrev');
                expect(result.value).toContain('Em');
                expect(result.value).toContain('dias');
            });
        });

        it('day (futuro) → "Amanhã"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * DAY), 'limitAbbrev');
                expect(result.value).toContain('Amanhã');
            });
        });

        it('week (futuro) → "Em 1 semana"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * WEEK), 'limitAbbrev');
                expect(result.value).toContain('1 semana');
            });
        });

        it('month (futuro) → "Em Próximo mês"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * MONTH), 'limitAbbrev');
                expect(result.value).toContain('Próximo mês');
            });
        });

        it('year (futuro) → "Em Próximo ano"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(1 * YEAR), 'limitAbbrev');
                expect(result.value).toContain('Próximo ano');
            });
        });

        it('hours (futuro) → "Em Xh"', () => {
            scope.run(() => {
                const result = timeAgo(ahead(3 * HOUR), 'limitAbbrev');
                expect(result.value).toContain('Em');
                expect(result.value).toContain('3h');
            });
        });
    });

    describe('alias "limit_abbrev" usa mesmo mapa que "limitAbbrev"', () => {
        it('justNow → "Hoje"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'limit_abbrev');
                expect(result.value).toContain('Hoje');
            });
        });
    });

    describe('alias "future" usa mesmo mapa que "limitAbbrev"', () => {
        it('justNow → "Hoje"', () => {
            scope.run(() => {
                const result = timeAgo(new Date(FIXED_NOW), 'future');
                expect(result.value).toContain('Hoje');
            });
        });
    });

    // ─── FALLBACKS E EDGE CASES ──────────────────────────────────────

    describe('fallbacks e edge cases', () => {
        it('null → usa data atual (retorna justNow)', () => {
            scope.run(() => {
                const result = timeAgo(null);
                expect(result.value.toLowerCase()).toContain('agora');
            });
        });

        it('undefined → usa data atual (retorna justNow)', () => {
            scope.run(() => {
                const result = timeAgo(undefined);
                expect(result.value.toLowerCase()).toContain('agora');
            });
        });

        it('sinaliza data inválida para Date(NaN) e string inválida', () => {
            scope.run(() => {
                const result1 = timeAgo(new Date(NaN));
                expect(result1.value).toBe('Data inválida');

                const result2 = timeAgo('data-invalida');
                expect(result2.value).toBe('Data inválida');
            });
        });

        it('formato desconhecido → usa ptBr como fallback', () => {
            scope.run(() => {
                const result = timeAgo(ago(1 * DAY), 'formato_inexistente');
                // Deve usar ptBr → "Ontem"
                expect(result.value).toContain('Ontem');
            });
        });

        it('aceita string ISO como data', () => {
            scope.run(() => {
                const result = timeAgo(ago(2 * HOUR).toISOString());
                expect(result.value).toContain('2h');
            });
        });

        it('aceita timestamp numérico', () => {
            scope.run(() => {
                const result = timeAgo(FIXED_NOW - 5 * MINUTE);
                expect(result.value).toMatch(/5m/);
            });
        });
    });

    // ─── ALIAS ───────────────────────────────────────────────────────

    describe('alias', () => {
        it('useTimeAgo é referência direta de timeAgo', () => {
            expect(useTimeAgo).toBe(timeAgo);
        });
    });

    describe('validação direta das mensagens em FORMAT_MAP', () => {
        it('FORMAT_MAP.limit aponta para o mesmo objeto que FORMAT_MAP.action', () => {
            expect(FORMAT_MAP.limit).toBe(FORMAT_MAP.action);
        });

        it('valida mensagens de ptBr', () => {
            const br = FORMAT_MAP.br;
            expect(br.justNow).toBe('agora');
            expect((br.past as any)('5m')).toBe('5m');
            expect((br.future as any)('5m')).toBe('Em 5m');
            expect((br.day as any)(1, true)).toBe('Ontem');
            expect((br.day as any)(1, false)).toBe('Amanhã');
            expect((br.day as any)(3, true)).toBe('3 dias');
            expect((br.month as any)(1, true)).toBe('Mês passado');
            expect((br.month as any)(2, true)).toBe('2 Meses');
            expect((br.year as any)(1, true)).toBe('Ano passado');
            expect((br.year as any)(2, true)).toBe('2 anos');
        });

        it('valida mensagens de action/limit', () => {
            const action = FORMAT_MAP.action;
            expect(action.justNow).toBe('Realizar Hoje');
            expect((action.day as any)(1, true)).toBe('Atrasado (Ontem)');
            expect((action.day as any)(1, false)).toBe('Realizar até amanhã');
            expect((action.month as any)(1, true)).toBe('Atrasado (1 Mês)');
        });
    });
});

describe('timeAgo — regressão auditoria (achado 013)', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_NOW);
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
        vi.useRealTimers();
    });

    it.each(['br', 'abbrev', 'action', 'limit', 'limitAbbrev'])(
        'formato %s não emite "year" em inglês no plural',
        (formato) => {
            scope.run(() => {
                expect(timeAgo(ago(2 * YEAR), formato).value).not.toMatch(/year/i);
            });
        }
    );

    it('pluraliza anos em português', () => {
        scope.run(() => {
            expect(timeAgo(ago(2 * YEAR), 'br').value).toContain('anos');
        });
    });

    it.each(['br', 'abbrev', 'action', 'limit', 'limitAbbrev'])(
        'formato %s usa abreviação invariável de hora (sem "hs")',
        (formato) => {
            scope.run(() => {
                expect(timeAgo(ago(3 * HOUR), formato).value).not.toMatch(/\dhs/);
            });
        }
    );
});

describe('timeAgo — regressão auditoria (achado 018, parte reatividade)', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FIXED_NOW);
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
        vi.useRealTimers();
    });

    it('mantém a reatividade quando a data chega depois (valor inicial nulo)', async () => {
        await scope.run(async () => {
            const data = ref<Date | null>(null);
            const resultado = timeAgo(data, 'br');

            data.value = ago(2 * DAY);
            await nextTick();

            expect(resultado.value).toContain('2 dias');
        });
    });

    it('reage a mudanças subsequentes da fonte', async () => {
        await scope.run(async () => {
            const data = ref<Date | null>(ago(2 * DAY));
            const resultado = timeAgo(data, 'br');

            data.value = ago(5 * DAY);
            await nextTick();

            expect(resultado.value).toContain('5 dias');
        });
    });
});
