# use-default-reset-testes-faltantes

- **Severidade**: média
- **Tipo**: teste-faltante
- **Arquivo**: `src/Composables/useDefaultReset.test.ts:103-121`

## Problema
O único teste de `timer` usa primitivo (`useDefaultReset('auto', 500)`), justamente o caso em que o loop infinito não se manifesta. Faltam: timer + objeto (loop), timer + mutação profunda, `timer: 0` (falsy, silenciosamente desativado na linha 58 — divergente da doc que só cita `null`), e `initialData: undefined` (`JSON.parse(JSON.stringify(undefined))` lança na linha 44).

## Decisão de Design Registrada
- `timer`: Somente valores numéricos positivos (`> 0`) ativam o auto-reset. Valores `0`, `null`, `undefined` ou negativos desativam o timer.
- `initialData: undefined`: Preservado graciosamente como `undefined` sem lançar exceção de `JSON.parse`.

## Plano de correção
1. Testes com fake timers contando disparos de reset em objeto (junto com [composables-use-default-reset-loop-infinito-timer-objeto](composables-use-default-reset-loop-infinito-timer-objeto.md)).
2. Teste de mutação profunda (junto com [composables-use-default-reset-timer-sem-deep](composables-use-default-reset-timer-sem-deep.md)).
3. Teste definindo comportamento para `timer: 0` e `initialData: undefined`.
