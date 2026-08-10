# random-typecode-nao-aceita-number-letter

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivo**: `src/Helpers/Strings/random.ts:8,17`

## Problema
```ts
type Typecode = `${string}${'lower' | 'ulid' | 'upper'}${string}`;
```
não admite os códigos suportados em runtime `'number'`, `'letter'` e `'nonumber'` (usados nas linhas 28-36) — `Random(10, 'number')` é erro de tipo apesar de funcionar. O runtime também trata `'letter'` como só minúsculas, o que surpreende.

## Decisão de Design Registrada
- Union explícita em `Typecode`: `'lower' | 'upper' | 'ulid' | 'number' | 'letter' | 'nonumber'`. Manter `'letter'` gerando apenas letras ASCII (a-z) e documentar.

## Plano de correção
1. Atualizar o tipo `Typecode` para a union explícita `'lower' | 'upper' | 'ulid' | 'number' | 'letter' | 'nonumber'`.
2. Documentar os tipos aceitos.

## Testes
- Teste de tipo (`expectTypeOf`) aceitando todos os códigos; teste de `'letter'` conforme decisão.
