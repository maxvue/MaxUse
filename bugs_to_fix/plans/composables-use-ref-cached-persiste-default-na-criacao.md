# use-ref-cached-persiste-default-na-criacao

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Composables/useRefCached.ts:72-75`

## Problema
O watcher de persistência usa `{ immediate: true }`: `useRefCached('k', 'default')` grava `'default'` em `localStorage['k']` imediatamente, sem nenhuma mudança. A doc (linha 8) diz "Quando o valor muda, persiste automaticamente". Efeito real: chaves "fantasma" criadas por simples leitura e perda da semântica "chave ausente".

## Plano de correção
1. Remover `immediate: true` do watcher de state (o watcher de `raw_key`, que já é immediate, cuida da leitura inicial). Alternativa: documentar o comportamento — decidir e alinhar doc + código.

## Testes
- Criar com localStorage vazio → `localStorage.getItem('k') === null` antes de qualquer mudança.
- Após mudar o state → valor persistido.
