# tipagem-any-generalizada-e-inconsistente (Routes)

- **Severidade**: média
- **Tipo**: tipagem
- **Arquivos**: `src/Routes/apiRoute.ts:13`, `apiGetRoute.ts:14-15`, `apiPostRoute.ts:14`, `apiPutRoute.ts:14`, `apiUploadRoute.ts:15,17`

## Problema
(a) `apiPutRoute(RouteName: string)` não aceita `null` enquanto `apiGetRoute`/`apiPostRoute`/`apiDeleteRoute` aceitam `string | null` — inconsistência.
(b) `const system_options: any = apiRoute(...)` descarta o tipo já inferido de `apiRoute`, anulando o narrowing.
(c) `options: any`, `data: any` e `Promise<any>` em toda a superfície pública — sem interface para `{ file?, error?, load_screen? }`, typos como `{ File: true }` compilam.

## Plano de correção
1. Declarar `interface ApiRouteOptions { load_screen?: boolean; file?: boolean; error?: boolean }` (exportada de `apiRoute.ts` ou `config.ts`).
2. Remover as anotações `: any` dos `system_options`.
3. Unificar `RouteName: string | null` em todos os wrappers.
4. Adicionar generic `<T = any>` nos retornos (`Promise<T | null>`).

## Testes
- Testes de tipo com `expectTypeOf` (vitest) cobrindo o narrowing do retorno e as options.
- Suíte existente continua passando (sem mudança de runtime).
