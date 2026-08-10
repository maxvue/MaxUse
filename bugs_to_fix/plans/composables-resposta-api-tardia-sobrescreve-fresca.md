# Resposta lenta antiga sobrescreve a resposta nova (sem guarda de sequência)

- **Severidade:** CRÍTICA
- **Arquivo:** [src/Composables/useRefCachedApi.ts](../../src/Composables/useRefCachedApi.ts) — linhas 86-101
- **Categoria:** condição de corrida

## Problema

Quando `route`/`params` mudam, o watcher dispara novo `apiGetRoute` **sem
invalidar o anterior**. A única guarda existente é `disposed`. As respostas são
aplicadas na ordem de **chegada**, não na ordem de **emissão**.

É a corrida clássica de paginação/busca: o usuário digita, dispara N
requisições, e a mais lenta — não a mais recente — vence.

## Evidência

```
api calls = [ { page: 1 }, { page: 2 } ]
after page2 resolve, state = {"page":2,"fresh":true}
after page1 (stale) resolve, state = {"page":1,"stale":true}
localStorage api.list = {"page":1,"stale":true}

× slow page=1 response resolves after fast page=2 and clobbers state
  → expected { page: 1, stale: true } to deeply equal { page: 2, fresh: true }
```

A resposta obsoleta contamina **tanto o `state` quanto o `localStorage`** — ou
seja, o dado errado persiste após o recarregamento da página.

## Causa raiz

Ausência de token de sequência. `disposed` só protege o caso de escopo
destruído — não o caso de requisição superada.

Divergência de documentação: o comentário na linha 85 afirma "resposta tardia
descartada", e o teste `useRefCachedApi.test.ts:150` tem nome equivalente — mas
cobre apenas o cenário de **escopo destruído**, nunca o de **requisição
superada**. O comportamento prometido não existe.

## Correção proposta

Token monotônico capturado por invocação:

```ts
let request_id = 0;

// dentro do watcher:
const my_id = ++request_id;
const value = await apiGetRoute(rName, pData);
if (disposed || my_id !== request_id || value == null) return;
```

## Teste de regressão

```ts
it('descarta resposta superada que chega atrasada', async () => {
    const p1 = deferred(); const p2 = deferred();
    apiGetRoute.mockReturnValueOnce(p1.promise).mockReturnValueOnce(p2.promise);

    params.value = { page: 1 }; await nextTick();
    params.value = { page: 2 }; await nextTick();

    p2.resolve({ page: 2, fresh: true });   // a mais nova chega primeiro
    await nextTick();
    p1.resolve({ page: 1, stale: true });   // a antiga chega depois
    await nextTick();

    expect(state.value).toEqual({ page: 2, fresh: true });
    expect(JSON.parse(localStorage.getItem('api.list')!)).toEqual({ page: 2, fresh: true });
});
```
