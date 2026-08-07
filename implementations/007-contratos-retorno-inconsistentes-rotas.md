# 007 — Contratos de retorno inconsistentes entre os helpers de rota

- **Severidade:** Média
- **Tipo:** Divergência de regra de negócio / inconsistência de API
- **Arquivos:** [src/Routes/](../src/Routes/) — `apiGetRoute.ts`, `apiPostRoute.ts`, `apiPutRoute.ts`, `apiDeleteRoute.ts`, `apiUploadRoute.ts`

## Descrição

Os helpers HTTP da família `api*Route` usam três estratégias diferentes para
sinalizar falha, sem um padrão claro:

| Helper            | Rota inválida | Erro HTTP        | Sucesso            |
|-------------------|---------------|------------------|--------------------|
| `apiGetRoute`     | *(crash)* ¹   | `null` + console | `response.data`    |
| `apiPostRoute`    | `false`       | `null` + console | `response.data`    |
| `apiPutRoute`     | `false`       | `null` + console | `response.data`    |
| `apiDeleteRoute`  | `false`       | `null` + console | `response.data`    |
| `apiUploadRoute`  | `false`       | *(propaga)* ²    | `response.data`    |

¹ ver [achado 006](./006-apiRoute-null-nao-tratado-apiGetRoute.md)
² `apiUploadRoute` não tem `try/catch`, então erros de rede rejeitam a Promise

## Problemas decorrentes

### 1. `false` vs `null` vs exceção

O consumidor precisa de três checagens diferentes dependendo do verbo:

```typescript
const a = await apiGetRoute('r');      // null em erro
const b = await apiPostRoute('r');     // false OU null
const c = await apiUploadRoute('r');   // false, ou throw
```

Como todos retornam `any`, o TypeScript não ajuda a lembrar disso.

### 2. Sucesso é indistinguível de falha

Se a API retorna legitimamente `null` (ex.: `204 No Content` ou um recurso
inexistente), o consumidor não consegue distinguir de um erro de rede. Da mesma
forma, um endpoint que retorna `false` como payload válido é indistinguível de
"rota não encontrada".

### 3. Erros engolidos

`apiPostRoute` faz `console.error` e retorna `null` — o erro original (com status
HTTP, corpo da resposta de validação, etc.) é descartado. Numa aplicação Laravel,
a resposta `422` com os erros de validação por campo é justamente a informação
mais útil, e ela é perdida.

```typescript
} catch (error) {
    console.error('>> Erro ao fazer a requisição - Rota: ' + RouteName, error);
    return null;   // ← corpo do 422 perdido
}
```

### 4. `console.error` não configurável

`apiGetRoute` suporta `{ error: false }` para silenciar; `apiPostRoute`,
`apiPutRoute` e `apiDeleteRoute` não — sempre poluem o console, inclusive em
produção.

## Correção sugerida

Padronizar em duas etapas (a segunda exige major version):

**Etapa 1 — sem quebrar API (patch/minor):**

- Adicionar a guarda `if (!system_options) return false;` em `apiGetRoute`
  (achado 006), alinhando ao restante.
- Suportar `options.error === false` em todos os verbos.
- Envolver `apiUploadRoute` em `try/catch` para alinhar ao contrato dos demais.
- Anexar o erro original a um campo acessível, ou re-exportar via callback
  `options.onError?.(error)`.

**Etapa 2 — contrato explícito (major):**

Adotar um retorno discriminado, que resolve todos os itens acima de uma vez:

```typescript
export type ApiResult<T> =
    | { ok: true; data: T }
    | { ok: false; reason: 'invalid-route' | 'request-failed'; error?: unknown };
```

Isso torna impossível confundir um `null` legítimo do servidor com falha, e
preserva o corpo da resposta de erro para tratamento pelo consumidor.

## Relacionado

- [006 — apiGetRoute não trata retorno null](./006-apiRoute-null-nao-tratado-apiGetRoute.md)
