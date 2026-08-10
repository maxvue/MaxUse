# wire-size-corrente-acima-da-tabela-sem-ampacidade

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:118-125`

## Problema
Quando `correctedCurrent` excede o maior `max_current` da tabela (ex.: 800 A em `cu-70-bi-a1.json`, máx. 767 A), `dados.find(...)` retorna `undefined` e **nenhuma restrição de ampacidade é aplicada**: a bitola fica só pela queda de tensão (risco de subdimensionamento) e `max_current` retorna a própria corrente pedida, sugerindo falsamente que o cabo suporta. O teste "pula if e else if quando a corrente excede a tabela" (`wireSize.test.ts:237`) documenta o buraco em vez de exigir tratamento.

## Plano de correção
1. Quando `!item`: retornar erro/null **ou** usar a última linha da tabela e sinalizar (`data_return.exceeded = true`), forçando `wire` ≥ maior bitola — decidir a semântica e documentar.
2. Atualizar o teste que hoje fixa o comportamento errado.

## Testes
- Corrente 900 A com método `a1`: retorna sinalização e nunca `max_current` menor que a corrente solicitada sem aviso.
