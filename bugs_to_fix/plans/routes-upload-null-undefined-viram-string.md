# upload-null-undefined-viram-string

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Routes/apiUploadRoute.ts:27-32`

## Problema
No loop de `data`, `null` e `undefined` caem no `else` e `formData.append(key, null|undefined)` envia as strings literais `"null"`/`"undefined"` ao servidor. Além disso, um `File`/`Blob` dentro de `data` é serializado via `JSON.stringify`, virando `"{}"` silenciosamente.

## Evidência
```ts
if (typeof value === 'object' && value !== null) formData.append(key, JSON.stringify(value));
else formData.append(key, value);
```

## Plano de correção
1. Pular chaves com `value == null` (`continue`).
2. Tratar `value instanceof Blob` com `append` direto (Files são Blobs).

## Testes
- `data = { a: null, b: undefined }` → `formData.has('a') === false` e `formData.has('b') === false`.
- `data = { anexo: file }` → `formData.get('anexo') instanceof Blob`.
