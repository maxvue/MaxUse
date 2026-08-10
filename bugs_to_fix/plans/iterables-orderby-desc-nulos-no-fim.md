# Ordenação de nulos ignora a direção `desc`

- **Severidade:** baixa (divergência não documentada)
- **Arquivo:** [src/Helpers/Iterables/orderBy.ts](../../src/Helpers/Iterables/orderBy.ts) — linhas 58-61
- **Categoria:** paridade / documentação

## Evidência

```
orderBy nulls desc
     mine   = [{a:3},{a:2},{a:1},{a:null},{a:undefined}]
     lodash = [{a:undefined},{a:null},{a:3},{a:2},{a:1}]
```

## Causa raiz

As guardas de `null`/`undefined` retornam `1`/`-1` **antes** de a direção ser
aplicada, fixando os nulos na cauda em ambos os sentidos. O Lodash os trata como
menores, então em `desc` eles vêm primeiro.

## Ressalva

`orderBy` está na lista dos 45 nomes, e a linha 13 do JSDoc documenta
"empurrados para o final" — então para `asc` isso é defensável como intencional.

O problema é que **não consta em "Diferenças conhecidas"** do
`DIVERGENCES.md`, e listas em `desc` com valores nulos divergem silenciosamente
do Lodash.

## Correção proposta

**Ação mínima: documentar.** Registrar a decisão em
`lodash_migrate/DIVERGENCES.md` e fixar o comportamento atual em teste, para que
a escolha seja deliberada e não acidental.

## Teste de regressão

```ts
it('mantém nulos no final também em desc (divergência documentada)', () => {
    const r = orderBy([{ a: 1 }, { a: null }, { a: 3 }], ['a'], ['desc']);
    expect(r.map(x => x.a)).toEqual([3, 1, null]);
});
```
