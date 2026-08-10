# Mapa de dedupe é compartilhado entre stores e métodos, servindo payload alheio

- **Severidade:** média
- **Arquivo:** [src/Routes/internal/cacheUtils.ts](../../src/Routes/internal/cacheUtils.ts) — linha 31
- **Categoria:** correção — colisão de chaves

## Problema

`inFlight` é um único `Map` de módulo, indexado **apenas pela chave de cache**.
Com uma chave customizada compartilhada, o corpo de um POST é devolvido como
resultado de um GET.

## Evidência

```
C: getCachedApi(rota.A)    => {"from":"https://x/rota.A"}
C: getCachedApiIDB(rota.B) => {"from":"https://x/rota.A"}     <-- payload da rota A
C: axios.get calls = [ 'https://x/rota.A' ]                   <-- rota.B nunca foi à rede

D: post => {"via":"POST"}   get => {"via":"POST"}
D: axios.post calls = 1     axios.get calls = 0
```

## Causa raiz

As chaves padrão não colidem (prefixos e formatos diferentes), então o defeito
exige uma `keyCache` informada pelo consumidor. Mas `keyCache` **é API pública**
e nada na documentação alerta contra reúso entre helpers.

## Correção proposta

Prefixar a chave de dedupe por helper e método:

```ts
dedupeRequest(`idb:GET:${key}`, ...)
dedupeRequest(`ls:GET:${key}`, ...)
dedupeRequest(`idb:POST:${key}`, ...)
```

Correção barata que elimina a classe inteira.

## Teste de regressão

```ts
it('não compartilha dedupe entre stores e métodos', async () => {
    const key = 'mesma-chave';
    const [a, b, c] = await Promise.all([
        getCachedApi('rota.A', {}, { keyCache: key }),
        getCachedApiIDB('rota.B', {}, { keyCache: key }),
        postCachedApiIDB('rota.C', {}, { keyCache: key })
    ]);
    expect(new Set([JSON.stringify(a), JSON.stringify(b), JSON.stringify(c)]).size).toBe(3);
});
```
