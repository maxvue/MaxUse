# 009 — Código IndexedDB duplicado entre `getCachedApiIDB` e `postCachedApiIDB`

- **Severidade:** Média
- **Tipo:** Sugestão de melhoria / risco de divergência
- **Arquivos:**
  - [src/Routes/getCachedApiIDB.ts:9-113](../src/Routes/getCachedApiIDB.ts#L9-L113)
  - [src/Routes/postCachedApiIDB.ts:9-113](../src/Routes/postCachedApiIDB.ts#L9-L113)

## Descrição

Ambos os arquivos contêm blocos **byte-a-byte idênticos** de ~105 linhas:

- Constantes `DB_NAME`, `STORE_NAME`, `DB_VERSION`
- `interface CacheEntry`
- `function openDB()`
- `async function getFromIDB()`
- `async function setToIDB()`
- `async function deleteFromIDB()`

A única diferença é que `getCachedApiIDB` exporta `deleteFromIDB` e
`clearCacheIDB`, enquanto `postCachedApiIDB` mantém `deleteFromIDB` privado.

## Impacto

### 1. Divergência silenciosa já em curso

Como as duas cópias evoluem independentemente, qualquer correção aplicada a uma
não chega à outra. O [achado 004](./004-getCachedApi-ignora-config-global.md) é
exatamente isso na prática: `postCachedApiIDB` **usa** `getConfiguredHeaders()` e
`getWithCredentials()`, enquanto `getCachedApiIDB` **não usa** — o mesmo bug foi
corrigido em um arquivo e não no outro.

### 2. Bundle inflado

Como são entradas do mesmo chunk `routes.es.js`, o Rollup pode deduplicar parte,
mas as funções são declarações locais distintas em cada módulo — o código
duplicado tende a ser emitido duas vezes, penalizando o tree-shaking que é o
objetivo declarado da biblioteca.

### 3. Superfície de teste duplicada

Testar `openDB`/`getFromIDB` exige cobrir as duas cópias, ou aceitar que uma delas
fica sem cobertura real.

## Correção sugerida

Extrair para um módulo interno compartilhado, ex.
`src/Routes/internal/idbCache.ts`:

```typescript
/** @internal Camada de cache IndexedDB compartilhada pelos helpers *CachedApiIDB. */
const DB_NAME = 'max_cache';
const STORE_NAME = 'api_cache';
const DB_VERSION = 1;

export interface CacheEntry { key: string; data: any; timestamp: number; }

export function openDB(): Promise<IDBDatabase> { ... }
export async function getFromIDB(key: string, ttl?: number): Promise<any | null> { ... }
export async function setToIDB(key: string, data: any): Promise<void> { ... }
export async function deleteFromIDB(key: string): Promise<void> { ... }
export async function clearCacheIDB(): Promise<void> { ... }
```

E nos dois helpers:

```typescript
import { getFromIDB, setToIDB } from './internal/idbCache';
```

Mantendo o re-export público de `deleteFromIDB`/`clearCacheIDB` a partir de
`getCachedApiIDB.ts` (ou, melhor, direto no `src/Routes/index.ts`) para não
quebrar a API pública atual.

## Observação sobre `localforage`

O [CLAUDE.md](../CLAUDE.md) afirma que os helpers cacheados "usam `localforage`
para caching em IndexedDB", e `localforage` está listado em `dependencies` no
`package.json`. Uma busca no código-fonte não encontra **nenhuma** importação de
`localforage` — a implementação é IndexedDB manual. Ver
[achado 010](./010-dependencias-nao-utilizadas.md).

## Relacionado

- [004 — getCachedApi ignora config global](./004-getCachedApi-ignora-config-global.md)
- [010 — dependências declaradas mas não utilizadas](./010-dependencias-nao-utilizadas.md)
- [020 — CLAUDE.md descreve implementação inexistente](./020-documentacao-desatualizada.md)
