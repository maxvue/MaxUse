# 002 — `isEmpty(0)` e `isEmpty(false)` retornam `false` (divergência de regra de negócio)

- **Severidade:** Média-Alta
- **Tipo:** Divergência de regra de negócio / inconsistência interna
- **Arquivos:**
  - [src/Helpers/Validations/isValid.ts:46-61](../src/Helpers/Validations/isValid.ts#L46-L61)
  - [src/Helpers/Types/hasContent.ts:12-23](../src/Helpers/Types/hasContent.ts#L12-L23)

## Descrição

A família `isEmpty`/`empty` trata **todo** número e **todo** booleano como
"não vazio", incluindo `0` e `false`:

```typescript
export function isEmpty<V>(value: V): value is NonNullable<V> {
    if (typeof value === 'boolean' || typeof value === 'number') return false;
    return size(value as any) === 0;
}
```

Comportamento confirmado em execução:

```
isEmpty(0)     → false
isEmpty(false) → false
notEmpty(0)    → true
```

Isso conflita diretamente com a outra família de checagem da biblioteca,
`hasContentFn`/`isBlank`, que por padrão trata `0` como **sem conteúdo**:

```typescript
if (typeof data === 'number') return data === 0 ? if_zero : true;  // if_zero default = false
```

Ou seja, na mesma biblioteca:

| Expressão          | Resultado |
|--------------------|-----------|
| `isEmpty(0)`       | `false` (não vazio) |
| `isBlank(0)`       | `true` (em branco)  |
| `notEmpty(0)`      | `true`  |
| `hasContent(0)`    | `false` |

`isEmpty` e `isBlank` são semanticamente equivalentes para o consumidor, mas
respondem de forma oposta para o mesmo input. Também difere do Lodash, onde
`_.isEmpty(0) === true`.

## Impacto

Um desenvolvedor que escolhe `isEmpty` ou `isBlank` para validar um campo de
formulário numérico terá resultados opostos. Como ambos os nomes são exportados
no objeto `_` e nos named exports, a escolha entre eles é arbitrária do ponto de
vista do consumidor.

## Correção sugerida

Escolher uma das duas rotas e documentá-la explicitamente:

**Rota 1 (recomendada):** alinhar `isEmpty` ao parâmetro `if_zero` já existente em
`isBlank`, mantendo o padrão consistente:

```typescript
export function isEmpty<V>(value: V, if_zero: boolean = false): boolean {
    if (typeof value === 'boolean') return false;
    if (typeof value === 'number') return value === 0 ? !if_zero : false;
    return size(value as any) === 0;
}
```

**Rota 2:** manter o comportamento atual, mas documentar no JSDoc de forma
destacada que `isEmpty` **nunca** considera `0`/`false` vazios, e adicionar um
"veja também `isBlank`" apontando a diferença.

Em qualquer caso, o JSDoc atual ("Verifica se um valor está vazio (tamanho === 0)")
é enganoso, porque a implementação faz um curto-circuito antes de calcular tamanho.
