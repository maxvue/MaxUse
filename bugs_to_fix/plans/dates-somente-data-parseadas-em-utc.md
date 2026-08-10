# Oito helpers ignoram `_parseDate` e deslocam datas `'YYYY-MM-DD'` em um dia

- **Severidade:** alta
- **Arquivos:** `isPast.ts:16`, `isFuture.ts:16`, `hasPassedDays.ts:21`, `hasPassedHours.ts:22`, `hasPassedMinutes.ts:21`, `timeAgo.ts:17,63,78` (em [src/Helpers/Dates/](../../src/Helpers/Dates/))
- **Categoria:** bug de correção — fuso horário

## Problema

`_parseDate.ts` existe **exatamente** para impedir que o JavaScript interprete
strings somente-data como UTC. `isWeekend`, `isSameDay`, `addTime`,
`inDateInterval` e `differences` o utilizam.

Estes oito pontos de chamada o ignoram e usam `new Date()` cru. Em
`America/Sao_Paulo` (UTC-3), `'2024-01-15'` vira `2024-01-14 21:00` — **outro
dia do calendário**.

## Evidência

```
TZ= America/Sao_Paulo offset= 180
new Date('2024-01-15')   = Sun Jan 14 2024 21:00:00 GMT-0300
_parseDate('2024-01-15') = Mon Jan 15 2024 00:00:00 GMT-0300

now local = Sun Jan 14 2024 23:00:00 GMT-0300
isPast("2024-01-15")   = true      <-- meia-noite de 15/01 ainda não chegou
isFuture("2024-01-15") = false
```

Duas funções da mesma biblioteca, recebendo a **mesma string**, discordam sobre
o dia da semana:

```
isWeekend("2024-01-14")          = true   via _parseDate  day=0 (domingo)
new Date("2024-01-14").getDay()  = 6                      (sábado)
```

## Causa raiz

Inconsistência interna: a biblioteca resolveu o problema, criou o utilitário
correto, e não o aplicou em todos os pontos. Não há razão de design aparente
para a divergência — é omissão.

O impacto é sutil e silencioso: em datas de fronteira (fim do dia), a resposta
sai errada; no meio do dia, sai certa. Isso torna o bug intermitente e difícil
de rastrear em produção.

## Correção proposta

Substituir `new Date(rawValue)` por `_parseDate(rawValue)` nos oito pontos, e
ramificar em `null` em vez de `isNaN(...)`.

## Teste de regressão

```ts
it('trata data-only no fuso local, não em UTC', () => {
    vi.setSystemTime(new Date('2024-01-15T02:00:00Z'));  // 23h de 14/01 em SP
    expect(isFuture('2024-01-15')).toBe(true);
    expect(isPast('2024-01-15')).toBe(false);
});

it('todos os helpers concordam sobre o dia da semana', () => {
    const s = '2024-01-14';
    expect(_parseDate(s)!.getDay()).toBe(0);
    expect(isWeekend(s)).toBe(true);
});
```
