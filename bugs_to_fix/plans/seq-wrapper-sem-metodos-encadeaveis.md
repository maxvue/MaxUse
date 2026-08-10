# `chain()` não tem `map`/`filter`/`take` — o contrato de encadeamento não existe

- **Severidade:** alta
- **Arquivos:** [src/Helpers/Seq/_MaxUseWrapper.ts](../../src/Helpers/Seq/_MaxUseWrapper.ts) linha 52; [src/Helpers/Seq/toJSON.ts](../../src/Helpers/Seq/toJSON.ts); [src/Helpers/Seq/valueOf.ts](../../src/Helpers/Seq/valueOf.ts)
- **Categoria:** funcionalidade ausente + documentação falsa

## Problema

O wrapper de `chain()` expõe apenas métodos de controle do próprio wrapper.
**Nenhum helper de coleção está no protótipo**, então o idioma mais comum do
Lodash — `_.chain(x).map(...).filter(...).value()` — lança `TypeError`.

Além disso, `toJSON` e `valueOf` não são métodos do protótipo, então
`JSON.stringify` de um chain vaza o estado interno do wrapper.

## Evidência

```
$ npx tsx -e "import {chain} from './src/Helpers/Seq/chain';
try{ console.log((chain([1,2,3]) as any).map((x:number)=>x*2).value()); }
catch(e:any){ console.log('THREW:',e.message); }
console.log('JSON.stringify(chain)=',JSON.stringify(chain([1,2,3])));"

THREW: (0 , import_chain.chain)(...).map is not a function
JSON.stringify(chain)= {"__wrapped__":[1,2,3],"__actions__":[],"__chain__":true,"__index__":0}
```

Métodos realmente presentes no protótipo:

```
_pushAction, at, chain, commit, constructor, next, plant, reverse, tap, thru, value
```

Comparação com o Lodash real:

| Expressão | MaxUse | Lodash |
|---|---|---|
| `chain([1,2,3]).map(x=>x*2).value()` | `TypeError` | `[2,4,6]` |
| `chain([1,2,3]).filter(...).take(1).value()` | `TypeError` | `[2]` |
| `JSON.stringify(chain([1,2,3]))` | `{"__wrapped__":...}` | `[1,2,3]` |
| `w.valueOf()` | o próprio wrapper | `[1,2,3]` |

## Causa raiz

**Encadeamento:** apenas os arquivos `wrapper*` fazem mixin de métodos; nenhum
helper de `Iterables`/`Objects` é anexado ao protótipo.

O comentário de documentação do próprio arquivo (linhas 14-17) afirma que
*"encadeamento de `.map().filter()...` é fiel ao Lodash"* — **o comentário é
falso**. Documentação que promete o que o código não entrega é pior que
ausência de documentação: o consumidor só descobre em produção.

**Serialização:** `toJSON` e `valueOf` são reexportados como funções autônomas
que recebem o wrapper por argumento. Mas ambos são métodos de **protocolo** — o
JavaScript só os honra quando estão no protótipo. Serializar um chain para um
payload de API embarca silenciosamente o estado interno.

## Correção proposta

Duas frentes independentes:

1. **Encadeamento** — anexar os helpers de `Iterables`/`Objects` ao
   `MaxUseWrapper.prototype`, cada um empilhando via `_pushAction` e retornando
   um wrapper.

   *Alternativa honesta e barata:* se encadeamento completo não for objetivo do
   projeto, **corrigir o comentário e o README** para declarar exatamente quais
   métodos existem. O inaceitável é a combinação atual (promessa + `TypeError`).

2. **Serialização** — definir `toJSON()` e `valueOf()` no protótipo delegando a
   `this.value()`, mantendo os exports autônomos como invólucros finos.

## Teste de regressão

```ts
it('encadeia map/filter e resolve com value()', () => {
    expect(chain([1, 2, 3]).map((x: number) => x * 2).value()).toEqual([2, 4, 6]);
});

it('serializa como o valor embrulhado, não como estado interno', () => {
    expect(JSON.stringify(chain([1, 2, 3]))).toBe('[1,2,3]');
    expect(chain([1, 2, 3]).valueOf()).toEqual([1, 2, 3]);
});
```

> Se a decisão for a alternativa (documentar em vez de implementar), o teste de
> regressão passa a ser: afirmar que o README e o comentário listam exatamente
> os métodos presentes no protótipo.
