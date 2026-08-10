# use-ref-cached-persiste-default-na-criacao

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Composables/useRefCached.ts:72-75`

## Problema
O watcher de persistência usa `{ immediate: true }`: `useRefCached('k', 'default')` grava `'default'` em `localStorage['k']` imediatamente, sem nenhuma mudança. A doc (linha 8) diz "Quando o valor muda, persiste automaticamente". Efeito real: chaves "fantasma" criadas por simples leitura e perda da semântica "chave ausente".

## Decisão de Design Registrada
- Remover `immediate: true` do watcher de `state`. A simples instanciação de `useRefCached` não grava o valor `default` no `localStorage` para evitar a criação de chaves fantasma e preservar a semântica de "chave ausente". A gravação no `localStorage` só ocorre quando `state` sofre mutação.

## Plano de correção
1. Remover `immediate: true` do watcher de `state` (o watcher de `raw_key`, que é immediate, cuida da leitura inicial do `localStorage`).

## Testes
- Criar com localStorage vazio → `localStorage.getItem('k') === null` antes de qualquer mudança.
- Após mudar o state → valor persistido.
