# wire-size-corrente-acima-da-tabela-sem-ampacidade

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:118-125`

## Problema
Quando `correctedCurrent` excede o maior `max_current` da tabela (ex.: 800 A em `cu-70-bi-a1.json`, máx. 767 A), `dados.find(...)` retorna `undefined` e **nenhuma restrição de ampacidade é aplicada**: a bitola fica só pela queda de tensão (risco de subdimensionamento) e `max_current` retorna a própria corrente pedida, sugerindo falsamente que o cabo suporta. O teste "pula if e else if quando a corrente excede a tabela" (`wireSize.test.ts:237`) documenta o buraco em vez de exigir tratamento.

## Decisão de Design Registrada
- Quando a corrente corrigida ultrapassar o maior `max_current` da tabela, utilizar a maior bitola disponível (última linha da tabela) e sinalizar a propriedade `exceeded: true` no retorno.

## Plano de correção
1. Tratar o caso em que a corrente excede a tabela selecionando o último item da tabela e adicionando `exceeded: true` no retorno.
2. Atualizar o teste correspondente.

## Testes
- Corrente 900 A com método `a1`: retorna sinalização e nunca `max_current` menor que a corrente solicitada sem aviso.
