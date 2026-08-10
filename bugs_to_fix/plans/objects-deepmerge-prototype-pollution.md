# Prototype pollution em `deepMerge` — sem guarda de `__proto__`

- **Severidade:** CRÍTICA — vulnerabilidade de segurança
- **Arquivo:** [src/Helpers/Objects/deepMerge.ts](../../src/Helpers/Objects/deepMerge.ts) — linha 22 (laço `Object.keys(dataSource).forEach`)
- **Categoria:** segurança (CWE-1321 Prototype Pollution)

## Problema

`deepMerge` permite poluir `Object.prototype` a partir de um payload JSON
controlado externamente. Qualquer aplicação que faça merge de configuração
vinda de API, query string ou entrada de usuário está exposta.

## Evidência

```
$ npx tsx -e "import { deepMerge } from './src/Helpers/Objects/deepMerge';
const payload = JSON.parse('{\"__proto__\":{\"polluted\":\"YES\"}}');
deepMerge({} as any, payload);
console.log('({} as any).polluted =', ({} as any).polluted);"

POLLUTION ({} as any).polluted = YES
```

Um objeto literal `{}` recém-criado passa a responder `"YES"` para
`.polluted`. O protótipo global foi contaminado.

## Escopo — `deepMerge` é o único vetor

Varredura de todos os helpers de mutação do repositório:

| Helper | `proto.polluted` |
|---|---|
| `merge`, `mergeWith`, `defaultsDeep` | `undefined` (seguro) |
| `set` (`'a.__proto__.polluted'`, `'constructor.prototype.polluted'`) | `undefined` (seguro) |
| `setWith`, `update`, `zipObjectDeep` | `undefined` (seguro) |
| `defaults`, `assign`, `transform`, `invert`, `mapKeys`, `deepClone` | `undefined` (seguro) |
| **`deepMerge`** | **`YES`** ← vetor |

## Causa raiz

`_baseSet.ts:44` e `_baseMerge.ts:107` já carregam a guarda explícita
`if (key === '__proto__' || key === 'constructor' || key === 'prototype')`.

`deepMerge` é um helper **próprio da MaxUse, anterior à migração do Lodash**, e
nunca foi trazido para baixo dessa guarda: ele itera `Object.keys(dataSource)` e
faz atribuição direta `dataTarget[key] = sourceValue` / descida recursiva, sem
filtrar chave alguma.

O detalhe que fecha o vetor: `Object.keys` sobre um payload vindo de
`JSON.parse` **inclui** `__proto__` como chave própria enumerável — diferente de
um objeto literal escrito no código. Por isso a atribuição caminha direto para
`Object.prototype`.

## Por que isso importa mesmo com `merge` seguro

`deepMerge` é exportado publicamente em `src/Helpers/Objects/index.ts:52` e é o
nome idiomático que um consumidor da MaxUse usa para mesclar configuração. Não
está na lista de 45 divergências intencionais (`deepMerge` é nome exclusivo da
MaxUse, sem contraparte no Lodash), então nenhuma política de divergência o
cobre.

## Correção proposta

Guarda mínima, preservando o comportamento atual, no topo do corpo do `forEach`:

```ts
Object.keys(dataSource).forEach((key) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
    // ...
```

Alternativa mais robusta: reaproveitar `baseMerge` e eliminar a recursão
própria — remove a duplicação de lógica que criou a divergência de segurança em
primeiro lugar. A guarda de uma linha é a correção mínima e imediata; a
unificação é a correção estrutural.

## Teste de regressão

`deepMerge.test.ts` tem hoje 10 casos, **todos de caminho feliz, nenhum de
segurança** — por isso o vetor sobreviveu.

```ts
it('não polui Object.prototype via __proto__', () => {
    deepMerge({} as any, JSON.parse('{"__proto__":{"polluted":"YES"}}'));
    expect(({} as any).polluted).toBeUndefined();
});

it('ignora chaves constructor/prototype', () => {
    deepMerge({} as any, JSON.parse('{"constructor":{"prototype":{"x":1}}}'));
    expect(({} as any).x).toBeUndefined();
});
```

> Os testes acima devem rodar em processo isolado ou limpar
> `Object.prototype` no `afterEach` — uma poluição bem-sucedida vaza para os
> demais testes do arquivo e produz falhas confusas em cascata.
