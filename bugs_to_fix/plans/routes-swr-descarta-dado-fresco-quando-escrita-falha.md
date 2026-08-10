# Falha ao gravar no cache descarta dado fresco — `onUpdate` nunca dispara

- **Severidade:** média
- **Arquivo:** [src/Routes/getCachedApiIDB.ts](../../src/Routes/getCachedApiIDB.ts) — linhas 75-79
- **Categoria:** tratamento de erro

## Problema

`fetchAndStore` aguarda `setToIDB` antes de retornar. Se a gravação rejeita, a
rejeição se propaga, o `.catch(() => {})` da revalidação a engole, e `onUpdate`
**nunca é chamado** — mesmo o servidor tendo enviado dados mais novos.

## Evidência

```
F: retorno= {"v":1}  onUpdate chamado= 0   (dado fresco v:2 nunca chega ao app)
```

## Causa raiz

Falha de **persistência** confundida com falha de **busca**. São coisas
distintas: não conseguir guardar não significa não ter obtido.

Com quota cheia, a interface congela silenciosamente em dado obsoleto, sem
qualquer sinal para o usuário nem para o desenvolvedor.

## Correção proposta

```ts
await setToIDB(key, data_return).catch(() => {});
```

dentro de `fetchAndStore`, para que o valor fresco seja sempre retornado e
`onUpdate` sempre dispare. Opcionalmente, expor `onCacheError` para que o
consumidor possa reagir à degradação.

## Teste de regressão

```ts
it('entrega dado fresco e dispara onUpdate mesmo com falha de escrita', async () => {
    setPutError(true);
    const onUpdate = vi.fn();
    await getCachedApiIDB('rota', {}, { onUpdate });
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ v: 2 }));
});
```
