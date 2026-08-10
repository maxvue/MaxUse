# status-nao-2xx-indistinguivel

- **Severidade**: média
- **Tipo**: regra-negocio
- **Arquivos**: `src/Routes/apiGetRoute.ts:36-40`, `apiPostRoute.ts:31-34`, `apiPutRoute.ts:31-34`, `apiDeleteRoute.ts:32-35`, `apiUploadRoute.ts:57-60`

## Problema
Qualquer falha (rede caída, 401, 419 CSRF, **422 de validação Laravel**) vira `null` + `console.error`. O chamador não tem acesso a `error.response.status` nem ao corpo de erros de validação — para uma lib voltada a Laravel/Adonis, perder o payload do 422 inviabiliza exibir erros de formulário. O contrato ainda mistura três retornos (`data | null | false`) sem tipagem que os distinga.

## Plano de correção
1. Adicionar `options.onError?: (error: unknown) => void` (recebe o erro axios completo) e/ou `options.throw?: boolean` para repropagar — sem quebrar o retorno `null` atual.
2. Documentar no JSDoc o acesso a `error.response.status`/`error.response.data`.
3. (Melhoria futura/v2) considerar envelope `{ data, error, status }`.

## Testes
- Mock de rejeição com `error.response.status = 422` e corpo de validação: `onError` recebe o erro; com `throw: true`, a promise rejeita; sem opções, retorna `null` (regressão).
