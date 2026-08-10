# Dedupe entrega resposta anterior a uma mutação invalidante

- **Severidade:** alta
- **Arquivos:** [src/Routes/internal/cacheUtils.ts](../../src/Routes/internal/cacheUtils.ts) linhas 37-45; [src/Routes/getCachedApiIDB.ts](../../src/Routes/getCachedApiIDB.ts) linha 75
- **Categoria:** condição de corrida — dado desatualizado

## Problema

Uma revalidação SWR em segundo plano se registra em `inFlight`. Se o cache for
invalidado em seguida (POST do usuário + `deleteFromIDB`), um **novo** chamador
sem cache recebe aquela promise já em voo — uma requisição que **saiu do cliente
antes da mutação** — e portanto dados pré-mutação.

## Evidência

```
L: A (cache hit)  => {"v":1}
L: B (cache miss) => {"v":"RESPOSTA-PRE-MUTACAO"}
L: axios.get calls = 1        (1 = B reusou a request antiga)
```

Variante do mesmo defeito — revalidação sobrescreve escrita local mais nova:

```
E: apos escrita local     = {"v":"NOVISSIMO-do-usuario"}
E: apos revalidacao concluir = {"v":"old"}
```

## Causa raiz

Entradas de dedupe não têm noção de **geração/época**. Uma vez registradas,
permanecem "juntáveis" mesmo depois de os dados que representam serem
comprovadamente obsoletos.

O dedupe é uma otimização correta em regime estacionário; o que falta é
invalidá-lo quando o mundo muda sob ele.

## Correção proposta

Dar ao `dedupeRequest` um gancho de invalidação: manter um contador de época por
chave, incrementado por `deleteFromIDB`/`clearCacheIDB`. Ao juntar-se a uma
entrada em voo, só reutilizar se a época **coincidir**; caso contrário, disparar
requisição nova.

A mesma verificação de época corrige as duas manifestações (entrega pré-mutação
e sobrescrita de escrita local).

## Teste de regressão

```ts
it('não reutiliza request em voo após invalidação', async () => {
    const p = iniciaRevalidacaoEmVoo('k');
    await deleteFromIDB('k');
    const b = getCachedApiIDB('rota', {});         // novo chamador, cache vazio
    await Promise.all([p, b]);
    expect(axios.get).toHaveBeenCalledTimes(2);    // não reutilizou
});

it('revalidação não sobrescreve escrita local mais nova', async () => {
    const rev = iniciaRevalidacaoEmVoo('k');
    await escritaLocal('k', { v: 'novo' });
    await rev;
    expect(await getFromIDB('k')).toMatchObject({ v: 'novo' });
});
```
