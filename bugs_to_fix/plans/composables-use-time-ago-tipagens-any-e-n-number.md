# use-time-ago-tipagens-any-e-n-number

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivo**: `src/Composables/useTimeAgo.ts:5-6,73,107`

## Problema
(a) `FORMAT_MAP: Record<string, any>` — deveria usar o tipo de mensagens do VueUse (`UseTimeAgoMessages`).
(b) `type n = number`, mas `past`/`future` recebem na prática as **strings** produzidas pelos formatadores de unidade (por isso o `n.toString().match(/\d/)`) — o tipo mente.
(c) `format: string` aceita qualquer coisa; uma union literal daria autocomplete e pegaria typos em compile-time.

## Plano de correção
1. Tipar o mapa com `UseTimeAgoMessages`.
2. `past`/`future` como `(v: number | string) => string`.
3. `format` como `'br' | 'abbrev' | 'action' | 'limit' | 'limitAbbrev' | 'limit_abbrev' | 'future'` (com fallback `(string & {})` se necessário).

## Testes
- Testes de tipo (`expectTypeOf`); suíte existente sem regressão.
