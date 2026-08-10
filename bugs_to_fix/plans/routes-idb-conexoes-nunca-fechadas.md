# idb-conexoes-nunca-fechadas

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Routes/internal/idbCache.ts:31-44,55,93,112,127`

## Problema
Cada operação (`getFromIDB`, `setToIDB`, `deleteFromIDB`, `clearCacheIDB`) chama `openDB()` criando uma **nova** conexão `IDBDatabase` que nunca recebe `close()`. Com uso repetido (revalidação a cada navegação), conexões acumulam; conexões abertas também bloqueiam upgrades futuros de versão do banco (`onblocked` tampouco é tratado).

## Plano de correção
1. Memoizar uma única promise de conexão em variável de módulo em `idbCache.ts`.
2. Registrar cleanup (fechar conexão + limpar a variável) via `onResetConfig()`, conforme regra do projeto para estado module-level em `Routes/`.
3. Tratar `onblocked`/erro invalidando a promise memoizada para permitir retry.

## Testes
- `indexedDB.open` é chamado uma única vez para N operações.
- Após `resetConfig()`, nova operação reabre a conexão.
