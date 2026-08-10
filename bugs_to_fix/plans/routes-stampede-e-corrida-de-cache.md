# stampede-e-corrida-de-cache

- **Severidade**: média
- **Tipo**: bug
- **Arquivos**: `src/Routes/getCachedApi.ts:31-49`, `src/Routes/getCachedApiIDB.ts:57-70`

## Problema
Não há deduplicação de requisições em voo. N chamadas concorrentes com a mesma chave fazem N misses e N GETs (stampede). Em `getCachedApiIDB`, duas revalidações em background concorrentes podem gravar no IDB fora de ordem (resposta mais antiga vencendo a mais nova) e `onUpdate` pode ser chamado com dado já obsoleto.

## Plano de correção
1. Manter um `Map<string, Promise<any>>` de requisições em voo por chave (limpando ao resolver/rejeitar), compartilhado entre os helpers cacheados.
2. Registrar a limpeza do mapa via `onResetConfig()` (regra do projeto para estado module-level em `Routes/`).

## Testes
- Duas chamadas concorrentes à mesma chave geram **uma** chamada `axios.get` e ambas resolvem com o mesmo dado.
- Após `resetConfig()`, o mapa é limpo.
