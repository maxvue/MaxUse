# 027 — Configuração global em singletons sem isolamento por instância

- **Severidade:** Média
- **Tipo:** Sugestão de melhoria arquitetural
- **Arquivo:** [src/Routes/config.ts](../src/Routes/config.ts)
- **Status:** ⚠️ **Parcialmente corrigido** — a Consequência 1 (vazamento de
  `activeRouter` entre testes) foi resolvida, junto com o alerta de SSR no JSDoc.
  As Consequências 2 e 3 seguem abertas: dependem da API de instância, que é
  breaking change.

## Descrição

Toda a configuração do módulo Routes vive em variáveis de módulo:

```typescript
let routeResolver: RouteResolver | null = null;
let apiConfig: ApiRequestConfig = { withCredentials: true };
```

E o `goToRoute.ts` adiciona mais um:

```typescript
let activeRouter: Router | null = null;
```

O padrão funciona para o caso comum (uma aplicação, configurada uma vez no
`main.ts`), mas tem consequências que valem ser conhecidas.

## Consequência 1 — testes acoplados à ordem de execução ✅ CORRIGIDO

O próprio código reconhece o problema ao expor `resetConfig()`:

```typescript
/**
 * Reseta toda a configuração. Útil para testes.
 * @internal
 */
export function resetConfig(): void {
    routeResolver = null;
    apiConfig = { withCredentials: true };
}
```

Porém `resetConfig()` **não resetava `activeRouter`** de `goToRoute.ts`, que é um
singleton em outro módulo. Um teste que chamasse `setLibraryRouter(mockRouter)`
deixava esse mock ativo para todos os testes subsequentes, sem forma suportada
de limpar.

### Correção aplicada

`config.ts` ganhou um registro de callbacks de limpeza, e `goToRoute.ts` registra
o seu na carga do módulo:

```typescript
// config.ts
const resetHandlers = new Set<() => void>();

/** @internal */
export function onResetConfig(handler: () => void): void {
    resetHandlers.add(handler);
}

export function resetConfig(): void {
    routeResolver = null;
    apiConfig = { withCredentials: true };
    for (const handler of resetHandlers) handler();
}

// goToRoute.ts
onResetConfig(() => { activeRouter = null; });
```

Optou-se por **registro** em vez de `config.ts` importar `goToRoute.ts`
diretamente porque `goToRoute` já importa de `config` — o import de volta criaria
uma dependência circular. O build foi verificado e não emite aviso de ciclo.

O JSDoc de `resetConfig` também passou a documentar o alerta de SSR descrito na
Consequência 3.

(A ressalva original sobre `resetConfig()` não desfazer a mutação de
`axios.defaults` deixou de se aplicar: essa mutação foi removida junto com o
achado 005.)

## Consequência 2 — micro-frontends e múltiplos backends

Uma aplicação que consome duas APIs com autenticações diferentes não consegue
configurar as duas:

```typescript
setApiRequestConfig({ headers: { Authorization: () => tokenA } });
// ...em outro módulo:
setApiRequestConfig({ headers: { Authorization: () => tokenB } });
// A segunda chamada sobrescreve; não há como ter as duas simultaneamente.
```

Em cenários de micro-frontend com múltiplas instâncias da lib compartilhando o
mesmo bundle, as instâncias interferem entre si.

## Consequência 3 — SSR: vazamento de configuração entre requisições

Num servidor Node com SSR, o módulo é carregado **uma vez** e compartilhado por
todas as requisições HTTP concorrentes. Se `setApiRequestConfig` for chamado por
requisição (para injetar o token do usuário atual), há vazamento:

```typescript
// Requisição do usuário A
setApiRequestConfig({ headers: { Authorization: () => tokenDoUsuarioA } });
await renderPage();   // ← await cede o controle

// Requisição do usuário B chega e sobrescreve
setApiRequestConfig({ headers: { Authorization: () => tokenDoUsuarioB } });

// A renderização de A retoma e usa o token de B → vazamento de dados entre usuários
```

Esse é o risco mais sério dos três. A mitigação atual — usar funções nos headers
(`() => getToken()`) — só funciona se `getToken()` for ele próprio isolado por
requisição (AsyncLocalStorage), o que a documentação não menciona.

## Correção sugerida

### Curto prazo (não quebra API) — ✅ JÁ APLICADO

Ambos os itens foram implementados; ver "Correção aplicada" na Consequência 1.
Nota: a proposta original era `config.ts` importar um `resetRouter()` de
`goToRoute.ts`, o que criaria dependência circular — foi substituída pelo
registro de callbacks.

### Longo prazo (major version)

Oferecer uma API de instância, mantendo os singletons como conveniência:

```typescript
export function createMaxUseRoutes(config: { resolver: RouteResolver } & ApiRequestConfig) {
    return {
        apiGetRoute: (name, data, options) => { /* usa esta config */ },
        apiPostRoute: (name, data, options) => { /* ... */ },
        getRoute: (name, data) => { /* ... */ }
        // ...
    };
}

// Os helpers globais atuais passam a ser uma instância default:
const defaultInstance = createMaxUseRoutes({ ... });
export const apiGetRoute = defaultInstance.apiGetRoute;
```

Isso resolve as três consequências de uma vez, mantém a ergonomia atual para o
caso simples, e torna os testes triviais de isolar (cada teste cria sua instância,
sem `resetConfig`).

## Relacionado

- Achados 004 e 005 (config global ignorada e mutação de `axios.defaults`) já
  foram corrigidos e removidos desta pasta.
