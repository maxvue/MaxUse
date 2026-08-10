# cases-quebram-palavras-acentuadas

- **Severidade**: média
- **Tipo**: bug
- **Arquivo**: `src/Helpers/Strings/cases.ts:17,33,49`

## Problema
O regex de tokenização usa só `[a-z]`/`[A-Z]` ASCII: caracteres acentuados quebram a palavra. Verificado: `snakeCase('João Silva') === 'jo_o_silva'` (e `kebabCase`/`camelCase` análogos). Grave para uma lib voltada a pt-BR.

## Evidência
```ts
stringData.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
```

## Decisão de Design Registrada
- Remover acentos via `normalize('NFD').replace(/\p{Diacritic}/gu, '')` antes da tokenização por regex. Assim, `snakeCase('João Silva')` => `'joao_silva'`, `camelCase('ação rápida')` => `'acaoRapida'`, `kebabCase('Coração Válido')` => `'coracao-valido'`.

## Plano de correção
1. Aplicar remoção de diacríticos na string de entrada antes da tokenização por regex em `src/Helpers/Strings/cases.ts`.

## Testes
- `snakeCase('João Silva')`, `camelCase('ação rápida')`, `kebabCase('Coração Válido')` com a semântica decidida.
