# mutacoes-sem-params-de-rota

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivo**: `src/Routes/apiRoute.ts:18`

## Problema
Para métodos não-GET, `apiRoute` chama `resolveRoute(RouteName)` sem params — não existe forma de chamar `apiPutRoute`/`apiDeleteRoute`/`apiPostRoute` numa rota com parâmetro de URL obrigatório (ex.: `api.usuarios.update` → `/api/usuarios/:id`, padrão universal em Laravel/Adonis). O `data` vira apenas o corpo. Isso inviabiliza resource routes, caso de uso primário declarado da lib.

## Evidência
```ts
const routeURL: string = method === 'GET' ? resolveRoute(RouteName, data) : resolveRoute(RouteName);
```

## Plano de correção
1. Adicionar suporte a `options.route_params` repassado a `resolveRoute` para todos os métodos, mantendo retrocompatibilidade.
2. Documentar no JSDoc dos wrappers.

## Testes
- `apiPutRoute('users.update', body, { route_params: { id: 1 } })` resolve com params.
- Regressão: sem `route_params`, comportamento atual se mantém.
