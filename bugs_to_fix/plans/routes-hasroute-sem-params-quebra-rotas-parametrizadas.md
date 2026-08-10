# hasroute-sem-params-quebra-rotas-parametrizadas

- **Severidade**: média
- **Tipo**: bug
- **Arquivos**: `src/Routes/config.ts:125-132`, `src/Routes/getRoute.ts:19`, `src/Routes/goToRoute.ts:51`

## Problema
`hasRoute(name)` chama `routeResolver(name)` sem params. Um resolver que valida parâmetros obrigatórios (retorna `null` quando falta `:id`) faz `hasRoute('users.show')` retornar `false` mesmo com a rota existindo — então `getRoute('users.show', { id: 1 })` retorna `null` e `goToRoute` cai indevidamente no fallback do Vue Router. O contrato de `RouteResolver` permite exatamente esse tipo de resolver.

## Evidência
```ts
return routeResolver(name) !== null; // config.ts:128
```

## Plano de correção
1. Aceitar `params` opcional: `hasRoute(name, params?)`, repassando ao resolver.
2. Atualizar call sites em `getRoute` e `goToRoute` para repassar os params recebidos.

## Testes
- Resolver que retorna `null` quando `params?.id` falta: `getRoute('users.show', { id: 1 })` deve resolver a URL; sem params, mantém comportamento atual.
