# reset-handlers-acumulam

- **Severidade**: baixa
- **Tipo**: melhoria
- **Arquivo**: `src/Routes/config.ts:28-36,166-171`

## Problema
`resetHandlers` é um `Set` que só cresce — `onResetConfig` não retorna função de unsubscribe e `resetConfig` não limpa o set. Em cenários de HMR/testes que re-registram closures, handlers antigos acumulam e rodam a cada reset. A API tampouco tem teste unitário direto.

## Plano de correção
1. Fazer `onResetConfig` retornar `() => resetHandlers.delete(handler)`.
2. Documentar no JSDoc.

## Testes
- Handler registrado é chamado no reset.
- Após chamar o unsubscribe retornado, o handler não é mais chamado.
