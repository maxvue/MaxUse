# Achados menores dos composables (sentinela, `any`, `onScopeDispose`, teste ausente)

- **Severidade:** baixa
- **Categoria:** qualidade / robustez

Agrupados por serem correções pequenas e independentes.

## 1. Sentinela `'no-key'` colide com chave legítima

[src/Composables/useRefCached.ts](../../src/Composables/useRefCached.ts) — linhas 29, 78, 98

Um chamador que use legitimamente a string `'no-key'` obtém **não-persistência
silenciosa**. Comprovado: `ls["no-key"] = null`.

**Correção:** usar `Symbol` ou `null` como sentinela, nunca uma string mágica
que pertence ao espaço de valores válidos do usuário.

## 2. `any` vazando em tipos públicos

- `useDefaultReset.ts:13` — `initialData?: any` (deveria ser `T`)
- `useRefCachedApi.ts:7-8` — `data_get`/`data` como `MaybeRefOrGetter<any>`

Comprovado no nível de tipo: `const x: string = s.initialData` compila para
`useDefaultReset({a: 1})` — ou seja, o tipo não protege nada.

**Correção:** tipar `initialData` como `T`; tornar os payloads genéricos ou
`Record<string, unknown>`.

## 3. `onScopeDispose` sem guarda

[src/Composables/useRefCached.ts](../../src/Composables/useRefCached.ts) — linha 62

Chamado sem guarda, emite `[Vue warn] onScopeDispose() is called when there is
no active effect scope` fora de escopo — e o listener de `storage` mais os dois
watchers **vazam permanentemente**.

`useRefCachedApi.ts:33` já protege com `getCurrentScope()`. Aplicar o mesmo
padrão.

## 4. `_parseDate` sem teste próprio

[src/Helpers/Dates/_parseDate.ts](../../src/Helpers/Dates/_parseDate.ts) não tem
`.test.ts`, apesar de ser o **núcleo de correção compartilhado** por 5+ helpers
de data — e o alvo da correção de
[dates-somente-data-parseadas-em-utc](./dates-somente-data-parseadas-em-utc.md).

**Correção:** criar `_parseDate.test.ts` cobrindo data-only, ISO com fuso,
timestamp numérico, epoch `0`, `Date` já pronto, e entradas inválidas.
