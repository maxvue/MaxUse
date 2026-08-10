# Troca de `key` mantém dados da chave anterior e os grava sob a nova chave

- **Severidade:** CRÍTICA — vazamento de dados entre usuários/tenants
- **Arquivo:** [src/Composables/useRefCachedApi.ts](../../src/Composables/useRefCachedApi.ts) — linhas 59-82
- **Categoria:** bug de correção + segurança/privacidade

## Problema

Ao trocar a `key` de `user-1` para `user-2`, o estado **continua com os dados do
user-1** — e a próxima mutação **persiste os dados do user-1 sob a chave do
user-2**.

Em aplicação multiusuário ou multi-tenant, isso é vazamento de dados entre
contextos: os dados de um usuário são exibidos para outro e gravados no
armazenamento local sob a identidade errada.

## Evidência

```
state (user-1)   = {"nome":"Alice","saldo":100}
state apos troca = {"nome":"Alice","saldo":100}     <-- deveria ser o default
ls user-2        = {"nome":"Alice","saldo":100,"visitas":1}   <-- dados da Alice sob user-2
```

## Causa raiz

O watcher de leitura de cache (linha 59) faz `return` antecipado quando a nova
chave não tem entrada em `localStorage` — mas **nunca redefine `state` para
`defaultValue`**. Enquanto isso, o watcher de escrita (linha 75) usa
`targetKey.value` **no momento da escrita**.

Resultado: estado obsoleto + chave nova = gravação cruzada.

## O irmão faz certo

`useRefCached` trata o caso corretamente (`useRefCached.ts:88`):

```ts
else state.value = default_value;
```

Confirmado na mesma execução: `useRefCached on missing key = DEFAULT`.

Os dois composables irmãos divergem no mesmo cenário — evidência de que se trata
de omissão, não de decisão.

## Correção proposta

Espelhar o comportamento de `useRefCached`: no watcher de `targetKey`, quando a
nova chave não tiver entrada em cache (ou o parse falhar), redefinir em vez de
retornar:

```ts
state.value = structuredClone(options.defaultValue ?? null);
```

> Ver também
> [composables-default-value-compartilhado-por-referencia](./composables-default-value-compartilhado-por-referencia.md):
> o `structuredClone` aqui é obrigatório, não opcional — sem ele a correção
> reintroduz o compartilhamento de referência do default.

## Teste de regressão

```ts
it('redefine para o default ao trocar para chave sem cache', async () => {
    const key = ref('user-1');
    const { state } = useRefCachedApi({ key, defaultValue: { nome: '' } });
    state.value = { nome: 'Alice', saldo: 100 };
    await nextTick();

    key.value = 'user-2';
    await nextTick();
    expect(state.value).toEqual({ nome: '' });
});

it('nunca grava dados do usuário anterior sob a chave nova', async () => {
    // ... troca de chave, mutação, e então:
    expect(localStorage.getItem('user-2')).not.toContain('Alice');
});
```
