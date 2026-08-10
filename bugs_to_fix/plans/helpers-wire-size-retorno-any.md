# wire-size-retorno-any

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivo**: `src/Helpers/Electrical/wireSize.ts:107`

## Problema
`const data_return: any` faz `wireSize` retornar `Promise<any>` — consumidores perdem autocomplete/checagem do shape `{ wire, max_current, voltage_drop, loss_percent }`.

## Plano de correção
1. Declarar `type WireSizeResult = { wire: number; max_current: number; voltage_drop: number; loss_percent: number }` (exportado) e tipar o retorno `Promise<WireSizeResult | null>`.

## Testes
- Teste de tipo com `expectTypeOf`; suíte existente sem regressão.
