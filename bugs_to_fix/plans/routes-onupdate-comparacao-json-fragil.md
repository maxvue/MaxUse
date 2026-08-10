# onupdate-comparacao-json-fragil

- **Severidade**: baixa
- **Tipo**: bug
- **Arquivo**: `src/Routes/getCachedApiIDB.ts:63`

## Problema
A revalidação compara `JSON.stringify(fresh) !== JSON.stringify(cached)`. `JSON.stringify` é sensível à ordem de chaves: o servidor devolvendo o mesmo objeto com ordem diferente dispara `onUpdate` falso-positivo (a doc promete callback só "quando encontra diferença").

## Evidência
```ts
if (onUpdate && JSON.stringify(fresh) !== JSON.stringify(cached)) onUpdate(fresh);
```

## Plano de correção
1. Usar comparação profunda com o helper próprio da lib (`isEqual` de `Helpers/Objects`) em vez de stringify.

## Testes
- Cache `{a:1,b:2}` e resposta `{b:2,a:1}` → `onUpdate` **não** chamado.
- Resposta realmente diferente → `onUpdate` chamado com o dado fresco.
