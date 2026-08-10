# A suíte de `idbCache` passa contra uma implementação que nunca toca IndexedDB

- **Severidade:** média (defeito de processo — permitiu os bugs de IDB)
- **Arquivos:** [src/Routes/internal/idbCache.test.ts](../../src/Routes/internal/idbCache.test.ts); [src/Routes/internal/testing/idbMock.ts](../../src/Routes/internal/testing/idbMock.ts)
- **Categoria:** teste que passa e nada prova

## Problema

Uma implementação deliberadamente quebrada de `idbCache`, apoiada num `Map`
simples — sem transação, sem `keyPath`, sem versionamento, sem conexão —
**satisfaz as asserções da suíte**.

## Evidência

```
O: impl que NUNCA toca IndexedDB passa em 5 das assercoes da suite idbCache.test.ts
P: mock contem "onabort"?         false
P: mock contem "oncomplete"?      false
P: mock contem "onversionchange"? false
P: mock contem "onblocked"?       false
P: impl trata tx.onabort?         false
   -> escrita abortada (quota) nunca resolve nem rejeita
```

## Causa raiz

O `transaction()` do mock devolve um objeto nu, só com `objectStore`. Não modela
**nenhum** ciclo de vida de transação.

É precisamente por isso que
[routes-idb-abort-trava-promise-para-sempre](./routes-idb-abort-trava-promise-para-sempre.md)
passou despercebido: **o mock não é capaz de expressar o modo de falha**. Um
teste só pode encontrar bugs que seu dublê consegue simular.

## Correção proposta

Estender `idbMock.ts` com objeto de transação real, suportando `oncomplete`,
`onabort` e `onerror`, mais interruptores `setAbortError(true)` e
`setQuotaError(true)`.

Acrescentar asserções de que `db.transaction` foi chamado com a store e o modo
corretos, e de que escritas só resolvem após `oncomplete`.

Executar **junto** com o plano de abort de transação — a correção do código
precisa deste mock para ser testável.

## Teste de regressão

```ts
it('escrita só resolve após oncomplete', async () => { /* ... */ });
it('abort de transação rejeita em vez de travar', async () => { /* ... */ });
it('onversionchange fecha a conexão e limpa o dbPromise memoizado', async () => { /* ... */ });
```
