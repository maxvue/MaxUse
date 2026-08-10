# Todas as asserções de `timeAgo.test.ts` passam contra uma implementação quebrada

- **Severidade:** média
- **Arquivo:** [src/Helpers/Dates/timeAgo.test.ts](../../src/Helpers/Dates/timeAgo.test.ts) — linhas 1-77
- **Categoria:** teste que passa e nada prova

## Problema

Toda asserção positiva é `toBeGreaterThanOrEqual` unilateral; toda negativa é
`toBe(0)` para `null`. Um mutante que devolva `999_999_999` para qualquer
entrada não-nula **satisfaz o arquivo inteiro**.

## Evidência

Mutante implementando as seis funções como
`(v) => v == null ? 0 : 999_999_999`, replicando as asserções exatas do
repositório:

```
✓ MUTANTE > secondsAgo: assercao real do repo
✓ MUTANTE > minutesAgo/hoursAgo/daysAgo/monthsAgo/yearsAgo: assercoes reais do repo

Test Files  1 passed (1)
     Tests  2 passed (2)
```

## Causa raiz

Asserções de **limite inferior** em vez de **valor exato**. `>= 0` é verdadeiro
para quase qualquer implementação — inclusive uma constante absurda.

Sem congelar o tempo, o autor não tinha como afirmar valor exato; a saída foi
afrouxar a asserção em vez de usar fake timers.

## Correção proposta

Congelar o tempo com `vi.setSystemTime` e afirmar **igualdade exata**, mais os
casos de fronteira ausentes (data futura, epoch `0`, string inválida).

## Teste de regressão

```ts
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2024-06-15T12:00:00Z')); });
afterEach(() => vi.useRealTimers());

it('calcula segundos exatos', () => {
    expect(secondsAgo(new Date(Date.now() - 10_000))).toBe(10);
});

it('retorna 0 para data futura', () => {
    expect(secondsAgo(new Date(Date.now() + 10_000))).toBe(0);
});
```
