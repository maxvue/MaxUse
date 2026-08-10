# upload-content-type-boundary

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Routes/apiUploadRoute.ts:49`

## Problema
`'Content-Type': 'multipart/form-data'` é fixado manualmente, sem `boundary`. Em SSR/Node (adapter http com `FormData` nativo) e em adapters que respeitam o header explícito, a requisição sai sem boundary e o servidor não consegue parsear o multipart. O correto com axios é **não** setar esse header quando o corpo é `FormData`.

## Evidência
```ts
headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data', ... }
```

## Plano de correção
1. Remover a linha do `Content-Type` e deixar o axios/ambiente inferir com boundary.

## Testes
- Assertar que o header `Content-Type` não está presente (ou `undefined`) nas opções passadas a `axios.post`, mantendo `Accept` e `X-Requested-With`.
