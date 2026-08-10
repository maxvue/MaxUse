# Abort de transação IDB deixa a promise pendente para sempre e envenena o dedupe

- **Severidade:** CRÍTICA
- **Arquivo:** [src/Routes/internal/idbCache.ts](../../src/Routes/internal/idbCache.ts) — linhas 154-163 (também 175-182, 192-199, 115-139)
- **Categoria:** bug de correção — travamento permanente

## Problema

Toda promise do IDB resolve exclusivamente por `request.onsuccess` /
`request.onerror`. **Nada escuta `tx.onabort` nem `tx.onerror`.**

Quando o navegador aborta a transação sem emitir evento de erro por request
— `QuotaExceededError`, `versionchange`, evicção de armazenamento — a promise
**nunca settla**.

## Evidência

```
R: getCachedApiIDB => TRAVOU | axios.get chamado? 1
   -> dados chegaram da rede mas o helper nunca os entrega
R: chamada seguinte => TAMBEM TRAVOU (dedupe envenenado)

Q: impl nunca registrou tx.onabort -> abort ignorado
Q: resultado = TRAVOU (promise pendente para sempre)
```

## Causa raiz e efeito cascata

Settlement vinculado só a eventos de request, ignorando o término em nível de
**transação**.

O agravante está em `fetchAndStore`: ele faz `await setToIDB(key, data)`
**dentro** de `dedupeRequest`. A promise travada permanece em `inFlight`
indefinidamente, e **toda chamada seguinte para aquela chave herda o
travamento**.

O detalhe mais perverso: **os dados da rede chegaram com sucesso** — apenas
nunca são entregues. Não há erro, não há timeout, não há recuperação. A tela
fica carregando para sempre.

## Correção proposta

Nos quatro helpers de IDB, registrar também o término em nível de transação:

```ts
tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
tx.onerror = () => reject(tx.error);
```

Para escritas, resolver em `tx.oncomplete` em vez de `request.onsuccess` — só
`oncomplete` garante durabilidade.

**Adicionalmente** (independente e igualmente importante): tornar a escrita em
cache não-fatal, para que falha de cache jamais retenha dado que a rede já
entregou:

```ts
await setToIDB(key, data).catch(() => {});
```

## Teste de regressão

```ts
it('rejeita (não trava) quando a transação aborta', async () => {
    mockAbortNextTransaction();
    await expect(setToIDB('k', { a: 1 })).rejects.toThrow();
});

it('entrega o dado da rede mesmo se a escrita no cache abortar', async () => {
    mockAbortNextTransaction();
    await expect(getCachedApiIDB('rota', {})).resolves.toEqual(dadosDaRede);
});
```

O mock atual **não consegue** expressar esse cenário — ver
[routes-testes-idb-fracos-e-mock-incompleto](./routes-testes-idb-fracos-e-mock-incompleto.md),
que precisa ser executado junto.
