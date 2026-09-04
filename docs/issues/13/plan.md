## PLANO DE IMPLEMENTAÇÃO

### Veracidade
**Confirmado — lacuna de API real.** A confirmação veio de **leitura de código + reprodução local**; não houve verificação por log de produção (`features.productionLogs: false`, biblioteca npm sem logging de produção).

Evidência de código:
- `grep -rn "signal" src --include=*.ts` (excluindo testes) não retorna **nenhuma** ocorrência. Nenhum helper monta `signal` no `AxiosRequestConfig`: `apiGetRoute.ts:24-31`, `apiPostRoute.ts:25-34`, `apiPutRoute.ts`, `apiDeleteRoute.ts:26-36`, `apiUploadRoute.ts:52-62`, `getCachedApi.ts:88-95`, `getCachedApiIDB.ts:22-29`, `postCachedApiIDB.ts:49-59`.
- `apiUploadRoute.ts:61` repassa `onUploadProgress` cru ao axios, sem qualquer guarda de cancelamento/desmontagem: `...(options?.onUploadProgress ? { onUploadProgress: options.onUploadProgress } : {})`.
- Agravante: `ApiRouteOptions` (`apiRoute.ts:23`) tem índice `[key: string]: any`. Consequência prática — `apiGetRoute(rota, {}, { signal })` **compila sem erro** e o `signal` é **silenciosamente descartado**. É uma falha silenciosa, não apenas uma ausência.

Reprodução local executada (script temporário fora do repositório, `npx tsx`, com `axios.get`/`axios.post` instrumentados para capturar o config recebido):

```
GET    config tem signal? false | chaves: [ 'responseType', 'headers', 'withCredentials' ]
UPLOAD config tem signal? false | chaves: [ 'headers', 'withCredentials', 'onUploadProgress' ]
```

Ou seja: um `AbortSignal` passado pelo consumidor nunca chega ao axios, e o `onUploadProgress` chega sem wrapper. A consequência descrita na issue (callback escrevendo em ref de componente desmontado, e requisições obsoletas de `useRefCachedApi` seguindo em voo apesar da guarda por `request_id` em `useRefCachedApi.ts:99-102`) decorre diretamente disso.

**Chance realista de sucesso: ~90%.** A propagação nos helpers diretos é trivial; o ponto de projeto que exige cuidado é a interação entre cancelamento e a deduplicação compartilhada (`internal/cacheUtils.ts:37-45`), resolvida abaixo com uma decisão explícita.

### Arquivos afetados
- `src/Routes/apiRoute.ts` — adiciona `signal?: AbortSignal` explicitamente a `ApiRouteOptions` (hoje só aceito via índice `[key: string]: any`), documentado.
- `src/Routes/apiGetRoute.ts` — propaga `options.signal` para o `AxiosRequestConfig`.
- `src/Routes/apiPostRoute.ts` — idem.
- `src/Routes/apiPutRoute.ts` — idem.
- `src/Routes/apiDeleteRoute.ts` — idem.
- `src/Routes/apiUploadRoute.ts` — propaga `signal` **e** envolve `onUploadProgress` em um wrapper que para de invocar o callback após o abort.
- `src/Routes/getCachedApi.ts` — novo parâmetro final opcional `options?: CachedApiOptions` com `signal`.
- `src/Routes/getCachedApiIDB.ts` — idem (parâmetro final, após `onUpdate`).
- `src/Routes/postCachedApiIDB.ts` — idem (parâmetro final, após `ttl`).
- `src/Routes/internal/cacheUtils.ts` — helper interno para "abandonar" a espera de uma promise deduplicada quando o chamador aborta (sem derrubar a requisição compartilhada dos demais).
- `src/Composables/useRefCachedApi.ts` — `AbortController` por requisição: aborta a anterior ao mudar rota/params e aborta no `onScopeDispose`.
- Testes colocados: `apiGetRoute.test.ts`, `apiUploadRoute.test.ts`, `getCachedApi.test.ts`, `useRefCachedApi.test.ts` (ou o arquivo de teste correspondente ao composable).

### Correções propostas

**1. Assinatura pública (retrocompatível).**

Em `apiRoute.ts`, dentro de `ApiRouteOptions`:

```ts
/** Sinal de cancelamento da requisição (AbortController) */
signal?: AbortSignal;
```

Puramente aditivo: todos os helpers `api*Route` já recebem `options` como terceiro (ou quarto) parâmetro opcional; nenhuma posição de argumento muda.

Para os helpers cacheados, que têm assinatura posicional, acrescenta-se **um último parâmetro opcional** — nenhuma posição existente é alterada:

```ts
export interface CachedApiOptions {
    /** Sinal de cancelamento da espera pela requisição */
    signal?: AbortSignal;
}

getCachedApi(routeName, dataToRequest?, keyCache?, ttl?, options?)
getCachedApiIDB(routeName, dataToRequest?, keyCache?, ttl?, onUpdate?, options?)
postCachedApiIDB(routeName, routeParams?, postData?, keyCache?, ttl?, options?)
```

`CachedApiOptions` é exportado de `src/Routes/index.ts` como tipo (fica disponível em `@maxvue/max-use` e em `@maxvue/max-use/routes`; nenhuma alteração em `vite.config.ts` ou no mapa `exports` do `package.json`, pois não há subpath novo).

**2. Propagação nos helpers diretos.** Em `apiGetRoute`/`apiPostRoute`/`apiPutRoute`/`apiDeleteRoute`, incluir no config do axios:

```ts
...(options?.signal ? { signal: options.signal } : {})
```

O padrão condicional segue o já usado em `apiUploadRoute.ts:61`, evitando enviar `signal: undefined`.

**3. `apiUploadRoute` — `signal` + guarda no `onUploadProgress`.**

```ts
const signal = options?.signal;
const progress_cb = options?.onUploadProgress;
const onUploadProgress = progress_cb
    ? (progressEvent: any) => {
        if (signal?.aborted) return;
        progress_cb(progressEvent);
    }
    : undefined;
```

e no config: `...(onUploadProgress ? { onUploadProgress } : {}), ...(signal ? { signal } : {})`.

Assim, ao abortar (tipicamente em `onScopeDispose`/`onUnmounted` do consumidor) o axios interrompe o XHR **e** o callback deixa de escrever em refs de um componente já destruído, mesmo que ainda haja um evento de progresso em trânsito. Além disso, o `catch` existente (linhas 64-70) precisa tratar cancelamento como caso não-erro: quando `axios.isCancel(error)` (ou `error?.code === 'ERR_CANCELED'`), **não** logar no console e **não** chamar `onError`; retornar `null` como hoje (e ainda respeitar `options.throw` se o consumidor pediu explicitamente). Sem esse ajuste, todo cancelamento normal vira ruído de `console.error`. O mesmo tratamento vale para os demais `api*Route`.

**4. Helpers cacheados e a deduplicação (decisão de projeto).** `dedupeRequest` (`cacheUtils.ts:37-45`) compartilha uma única promise entre chamadores concorrentes. Abortar o axios subjacente por causa de **um** chamador quebraria os outros. Decisão:

- o `signal` dos helpers cacheados **cancela a espera do chamador** (a promise retornada rejeita com um erro de cancelamento assim que o sinal dispara), **sem** derrubar a requisição compartilhada nem o gravação no cache;
- quando **não** houver requisição em voo para a chave (o chamador é quem cria a requisição), o `signal` também é repassado ao `AxiosRequestConfig`, obtendo cancelamento real de rede no caso comum de um único chamador;
- implementação centralizada em `cacheUtils.ts` como `raceWithSignal(promise, signal)` (função interna, exportada apenas para uso do módulo `Routes/`), para os três helpers usarem a mesma semântica.

Não é introduzido nenhum estado de módulo novo; nada a registrar em `onResetConfig()`. Mudanças de IndexedDB não são necessárias — `internal/idbCache.ts` permanece intocado (o cancelamento não interrompe a gravação no cache, por projeto).

**5. `useRefCachedApi`.** No watcher de sincronização (`useRefCachedApi.ts:95-111`), manter a guarda por `request_id` (defesa em profundidade) e acrescentar:

```ts
let active_controller: AbortController | null = null;
```

- ao entrar no watcher: `active_controller?.abort(); active_controller = new AbortController();`
- chamar `apiGetRoute(rName, pData, { signal: active_controller.signal })`;
- no `onScopeDispose` já existente (linhas 38-40): `active_controller?.abort();` além de `disposed = true`.

Resultado: requisições obsoletas param de custar rede/CPU, e a desmontagem cancela a requisição em voo. O `catch` vazio existente (linhas 106-108) já absorve a rejeição por cancelamento.

**6. Fora de escopo (explicitado).**
- `CancelToken` legado do axios (deprecado) — apenas `AbortSignal`.
- `timeout`/retry/backoff automáticos.
- Cancelamento cooperativo do `dedupeRequest` com contagem de assinantes (abortar a rede só quando *todos* desistirem) — complexidade desproporcional; registrar como melhoria futura se houver demanda.
- Cancelamento de escritas em IndexedDB/localStorage já iniciadas.
- Revalidação em background do `getCachedApiIDB` (linhas 75-79): permanece não cancelável, por ser deliberadamente "fire-and-forget".
- `goToRoute`/`getRoute` (não fazem HTTP).

### Banco de dados
Nenhuma (projeto sem banco).

### Riscos de quebra
- **Assinaturas**: todas as mudanças são aditivas (campo opcional em interface existente; parâmetro final opcional nos helpers cacheados). Nenhuma chamada existente de consumidor deixa de compilar por posição de argumento.
- **Risco de tipagem**: hoje `ApiRouteOptions` aceita qualquer chave via `[key: string]: any`. Ao tipar `signal?: AbortSignal`, um consumidor que passe `signal` com outro tipo (por exemplo, um `CancelToken`) passa a receber erro de compilação. Risco baixo, porém real, e deve constar no CHANGELOG.
- **Mudança de comportamento observável**: quem já passa `signal` hoje (silenciosamente ignorado) passará a ter a requisição realmente cancelada. É o comportamento pretendido, mas é uma mudança de comportamento em pacote publicado — merece nota de release (semver minor).
- **Log de erro**: suprimir `console.error` em cancelamentos pode afetar testes que contam chamadas de `console.error` nos `*.test.ts` de `Routes/`; verificar `apiGetRoute.test.ts` e `apiUploadRoute.test.ts`.
- **Testes existentes**: os mocks de axios nesses testes ignoram campos extras do config, então a propagação de `signal` não deve quebrá-los; baseline atual verificado com `npx vitest run src/Routes/apiUploadRoute.test.ts` (passando). A suíte completa deve ser executada.
- **`useRefCachedApi`**: abortar a requisição anterior a cada mudança de params altera a temporização em testes que dependem de respostas fora de ordem; a guarda por `request_id` continua no lugar justamente para que a semântica de "última resposta vence" não mude.
- **Auto-import**: nenhum export de runtime novo (apenas tipos) — `autoImportData.json` é regerado no `prebuild` de qualquer forma.

### Validação
Testes colocados a acrescentar:

1. `src/Routes/apiGetRoute.test.ts` — com `axios.get` mockado, chamar `apiGetRoute('rota', {}, { signal: controller.signal })` e afirmar que o config recebido contém exatamente esse `signal`. Repetir o padrão em `apiPostRoute.test.ts`, `apiPutRoute.test.ts` e `apiDeleteRoute.test.ts`.
2. `src/Routes/apiUploadRoute.test.ts` —
   - o config passado ao `axios.post` contém `signal`;
   - com `onUploadProgress` fornecido, capturar o wrapper repassado ao axios, chamar `controller.abort()` e então invocar o wrapper: o callback do consumidor **não** deve ser chamado (prova direta do cenário de desmontagem da issue);
   - cancelamento (`ERR_CANCELED`) não gera `console.error` e não chama `onError`.
3. `src/Routes/getCachedApi.test.ts` — com um sinal já abortado, a promise rejeita/encerra sem gravar no `localStorage`; com dois chamadores concorrentes na mesma chave, abortar um **não** afeta o resultado do outro (prova a decisão do item 4). Limpar `localStorage` e chamar `resetConfig()` no `beforeEach`/`afterEach`, como já faz a suíte.
4. `src/Composables/useRefCachedApi` — ao descartar o escopo (`effectScope().stop()`), o `signal` recebido por `apiGetRoute` fica `aborted === true`.

Comandos:

```bash
npx vitest run src/Routes
npx vitest run src/Composables
npm test
npm run lint
npm run type-check
npm run build
```