# unset-path-simplista

- **Severidade**: média
- **Tipo**: divergencia-lodash
- **Arquivo**: `src/Helpers/Objects/unset.ts:15-28`

## Problema
Mesmo problema de `get`/`set`: parsing de path por regex `replace(/\[(\w+)\]/...)` em vez de `castPath`/`toPath`. Não trata chaves literais com ponto, símbolos, nem aspas — `unset({'a.b':1}, 'a.b')` tenta descer em `a` → `b` em vez de deletar a chave literal. Também não tem a guarda de pollution.

## Plano de correção
1. Usar `castPath(path, object, toPath)` para resolver o caminho (mesma refatoração de [lodash-get-nao-trata-chave-literal](lodash-get-nao-trata-chave-literal.md)).
2. Adicionar guarda `__proto__`/`constructor`/`prototype` por consistência.

## Testes
- `unset` de chave literal com ponto que existe; path com índice de array; regressão da suíte existente.
