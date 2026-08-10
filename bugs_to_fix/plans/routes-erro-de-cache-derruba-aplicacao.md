# Erro de leitura do cache derruba a aplicação mesmo com a rede saudável

- **Severidade:** alta
- **Arquivos:** [src/Routes/getCachedApiIDB.ts](../../src/Routes/getCachedApiIDB.ts) linha 71; [src/Routes/postCachedApiIDB.ts](../../src/Routes/postCachedApiIDB.ts) linha 41
- **Categoria:** bug de correção — tratamento de erro

## Problema

`const cached = await getFromIDB(key, ttl);` não tem guarda, e `getFromIDB`
rejeita em `request.onerror` (idbCache.ts:138). Uma falha ao **ler o cache**
propaga como falha da operação inteira.

## Evidência

```
G: REJEITOU com: get error -> app quebra mesmo com a rede OK
```

## Causa raiz

O cache está sendo tratado como **dependência obrigatória** quando deveria ser
**otimização**. O contrato correto de um cache é: se não der para ler, busca na
rede. Nunca: se não der para ler, falha tudo.

Cenários reais que disparam isso: modo privativo do navegador, quota estourada,
IndexedDB desabilitado por política corporativa, corrupção do banco local.

## Correção proposta

Degradar graciosamente nos dois arquivos:

```ts
const cached = await getFromIDB(key, ttl).catch(() => null);
```

## Teste de regressão

```ts
it('busca na rede quando a leitura do cache falha', async () => {
    setGetError(true);
    await expect(getCachedApiIDB('rota', {})).resolves.toEqual(dadosDaRede);
});

it('postCachedApiIDB também degrada com erro de leitura', async () => {
    setGetError(true);
    await expect(postCachedApiIDB('rota', {})).resolves.toEqual(dadosDaRede);
});
```
