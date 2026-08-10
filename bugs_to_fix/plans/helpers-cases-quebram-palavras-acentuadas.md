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

## Plano de correção
1. Aplicar `normalize('NFD').replace(/[̀-ͯ]/g, '')` antes do match (como `slugify` já faz em `manipulations.ts:34-35`) **ou** incluir `À-ÿ` nas classes do regex — decidir se a saída preserva acentos (`joão_silva`) ou remove (`joao_silva`) e documentar.

## Testes
- `snakeCase('João Silva')`, `camelCase('ação rápida')`, `kebabCase('Coração Válido')` com a semântica decidida.
