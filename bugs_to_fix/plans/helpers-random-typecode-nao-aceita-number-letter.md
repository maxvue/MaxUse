# random-typecode-nao-aceita-number-letter

- **Severidade**: baixa
- **Tipo**: tipagem
- **Arquivo**: `src/Helpers/Strings/random.ts:8,17`

## Problema
```ts
type Typecode = `${string}${'lower' | 'ulid' | 'upper'}${string}`;
```
não admite os códigos suportados em runtime `'number'`, `'letter'` e `'nonumber'` (usados nas linhas 28-36) — `Random(10, 'number')` é erro de tipo apesar de funcionar. O runtime também trata `'letter'` como só minúsculas, o que surpreende.

## Plano de correção
1. Trocar por union explícita: `'lower' | 'upper' | 'ulid' | 'number' | 'letter' | 'nonumber'`.
2. Decidir se `'letter'` deve incluir maiúsculas; documentar.

## Testes
- Teste de tipo (`expectTypeOf`) aceitando todos os códigos; teste de `'letter'` conforme decisão.
