# 003 — `size(n)` retorna o próprio número, permitindo `size` negativo

- **Severidade:** Média
- **Tipo:** Bug / decisão de design perigosa
- **Arquivo:** [src/Helpers/Iterables/size.ts:13-31](../src/Helpers/Iterables/size.ts#L13-L31)

## Descrição

`size` aceita números e, com `allow_number = true` (padrão), retorna o próprio
valor numérico em vez de um tamanho:

```typescript
if (typeof data === 'number' && allow_number) return data;
```

Confirmado em execução:

```
size(5)  → 5
size(-3) → -3
```

Uma função chamada `size` retornando `-3` viola a invariante básica de que tamanho
é sempre `>= 0`. Todo consumidor que assume `size(x) >= 0` fica exposto.

## Cenário de falha concreto

`notEmpty`/`isNotEmpty` em [isValid.ts](../src/Helpers/Validations/isValid.ts)
delegam para `size`:

```typescript
export function notEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return true;
    return size(value as any) > 0;
}
```

Aqui há um curto-circuito para `number`, então o caso direto está protegido. Mas
qualquer código de consumidor que faça:

```typescript
if (size(saldo) > 0) { /* considera "tem conteúdo" */ }
```

vai concluir que um saldo de `-500` está "vazio", quando o dado existe.

Igualmente, `size(0)` retorna `0` por duas razões diferentes (é zero como valor, e
`isBlank(0, false)` retorna `true` na linha 20), tornando impossível distinguir
"número zero" de "coleção vazia".

## Correção sugerida

Duas opções, em ordem de preferência:

**Opção A — normalizar para valor absoluto ou zero:**

```typescript
if (typeof data === 'number' && allow_number) return Math.max(0, Math.trunc(data));
```

**Opção B — separar as responsabilidades:** manter `size` estritamente para
coleções/strings e criar um helper distinto (`countOf`, `numericValue`) para o
comportamento de passthrough numérico. Essa é a solução mais limpa a longo prazo,
mas quebra a API pública — exige major version.

Em qualquer caso, o JSDoc deve documentar explicitamente que valores negativos são
possíveis hoje, se o comportamento for mantido.

## Relacionado

- [002 — isEmpty(0) e isEmpty(false) retornam false](./002-isEmpty-zero-e-false-nunca-vazios.md)
