# use-cached-api-stringify-undefined-grava-lixo

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Composables/useRefCachedApi.ts:48-52`

## Problema
`JSON.stringify(state.value)` retorna `undefined` (não-string) quando `state.value === undefined`; `localStorage.setItem(key, undefined)` grava a string `"undefined"`, que na próxima carga falha o `JSON.parse` e é descartada — gravação inválida e perda silenciosa.

## Plano de correção
1. No watcher de persistência: `if (serialized === undefined) localStorage.removeItem(key); else localStorage.setItem(key, serialized);`.

## Testes
- Setar `state.value = undefined` → chave removida do localStorage.
- Valores serializáveis continuam persistidos (regressão).
