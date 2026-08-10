# chave-cache-ordem-de-chaves

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivos**: `src/Routes/getCachedApi.ts:27`, `getCachedApiIDB.ts:54`, `postCachedApiIDB.ts:37`

## Problema
A chave default é `route_name + '_' + JSON.stringify(params)`. Objetos semanticamente iguais com ordem de inserção diferente (`{a,b}` vs `{b,a}`) geram chaves distintas → miss desnecessário e entradas duplicadas. Também não há prefixo/namespace no localStorage (`getCachedApi` pode colidir com chaves da própria app).

## Plano de correção
1. Criar serialização estável (stringify com chaves ordenadas recursivamente) num helper interno compartilhado de `Routes/`.
2. Prefixar a chave default do localStorage (ex.: `max_cache:`), com migração suave (ler chave antiga como fallback é opcional; documentar breaking se não).

## Testes
- Mesma rota com `{a:1,b:2}` e `{b:2,a:1}` reutiliza a mesma entrada de cache.
- Chave default no localStorage tem o prefixo.
