# goto-route-url-absoluta-no-router

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Routes/goToRoute.ts:52`

## Problema
Quando a rota existe no resolver, faz `activeRouter.push(resolveRoute(...))`. Resolvers estilo Ziggy retornam por padrão URL **absoluta** (`https://app.test/users/1`); `router.push` do vue-router trata a string como path relativo da SPA, gerando navegação quebrada. Além disso, o `!` em `resolveRoute(...)!` é assertion desnecessária (a função retorna `string` e lança em falha) e há um `;` sobrando na linha 54.

## Evidência
```ts
activeRouter.push(resolveRoute(route_value, data_value)!);
```

## Plano de correção
1. Extrair pathname+search quando a URL for absoluta: `new URL(url, location.origin)` → `url.pathname + url.search + url.hash` antes do `push`.
2. Remover o `!` e o `;` sobrando.

## Testes
- Resolver retornando `https://example.com/users/1?x=1` → `push` recebe `/users/1?x=1`.
- Resolver retornando URL relativa → comportamento inalterado.
