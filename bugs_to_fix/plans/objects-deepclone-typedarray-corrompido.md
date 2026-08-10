# `cloneDeep` produz TypedArray corrompido que mente no `instanceof`

- **Severidade:** alta
- **Arquivo:** [src/Helpers/Objects/deepClone.ts](../../src/Helpers/Objects/deepClone.ts) — linhas 57-70 (fallback genérico)
- **Categoria:** bug de correção — valor inválido que passa em type guard

## Problema

O clone de `TypedArray`, `ArrayBuffer` e primitivos encaixotados é
estruturalmente quebrado: **passa no `instanceof`, mas todo método lança**.

Essa combinação é pior que um erro direto — o valor atravessa a checagem de
tipo do consumidor e só explode lá adiante, longe da origem.

## Evidência

```
$ npx tsx -e "import { cloneDeep } from './src/index';
const c:any = cloneDeep(new Uint8Array([1,2,3]));
console.log('tag=', Object.prototype.toString.call(c), '| instanceof =', c instanceof Uint8Array);
console.log('byteLength', c.byteLength);"

tag= [object Object] | instanceof Uint8Array = true
byteLength THREW: Method get TypedArray.prototype.byteLength called on incompa...
```

`instanceof Uint8Array` responde `true` enquanto
`Object.prototype.toString.call(c)` responde `[object Object]` e qualquer
acesso a método falha.

Demais tipos afetados na mesma varredura:

| Entrada | Resultado |
|---|---|
| `new Uint8Array([1,2,3])` | lança em `.byteLength` |
| `new ArrayBuffer(4)` | lança em `.byteLength` |
| `Object(5)` (Number encaixotado) | lança em `.valueOf()` |
| `Object('ab')` (String encaixotada) | lança em `.valueOf()` |
| `/a/g` com `lastIndex=3` | `lastIndex` volta `0` (perdido) |
| `new Error('boom')` | `message` vira `""` |

## Causa raiz

`cloneDeep` é apelido do helper próprio `deepClone`
(`src/Helpers/Objects/index.ts:54`: `export { deepClone as cloneDeep };`), e
**não** do port fiel do Lodash que já existe neste repositório.

`deepClone` trata explicitamente apenas `Date`, `RegExp`, `Map`, `Set`, `Array`
e objeto simples. Todo o resto cai no fallback das linhas 62-70:
`Object.create(Object.getPrototypeOf(data))` + cópia de propriedades índice a
índice. Para um typed array isso produz um objeto comum **vestindo**
`Uint8Array.prototype` — daí o `instanceof` verdadeiro e os métodos quebrados.

**A correção já existe no repositório.** `src/Helpers/Lang/_baseClone.ts` tem um
`initCloneByTag` completo e correto (ArrayBuffer, DataView, as 11 tags de
TypedArray, primitivos encaixotados, `RegExp.lastIndex`):

```
$ npx tsx -e "import { baseClone } from './src/Helpers/Lang/_baseClone';
const c:any = baseClone(new Uint8Array([1,2,3]), true);
console.log(Object.prototype.toString.call(c));"

[object Uint8Array]
```

O `cloneDeep` público simplesmente não roteia para lá.

## Sobre a política de divergências

`cloneDeep` **está** na lista dos 45 nomes de divergência intencional, e a
precedência "helpers próprios vencem" é deliberada — isso é respeitado.

Ainda assim este achado é válido: não se trata de divergência de design, e sim
de **crash + type guard mentiroso**. O JSDoc do próprio `deepClone` promete
tratar "diversos tipos de dados" e preservar protótipos para `instanceof`;
entregar um valor onde `instanceof` passa e todo método lança não é resultado
que alguém queira. Além disso, este comportamento **não está documentado** na
seção "Diferenças conhecidas" (que lista só `deburr` e `template`) — no mínimo,
é lacuna de documentação.

## Correção proposta

Em `deepClone.ts`, antes do fallback genérico da linha 57, delegar objetos com
tag reconhecida para `baseClone(data, true)` — ou adicionar ramo explícito para
`ArrayBuffer.isView(data)` e `data instanceof ArrayBuffer`, espelhando
`initCloneByTag`.

Complementos no mesmo arquivo:
- ramo `RegExp` (linha 33): acrescentar `result.lastIndex = data.lastIndex`;
- ramo `Error`: copiar `message`, `stack` e `name`.

## Teste de regressão

`deepClone.test.ts` não tem hoje **nenhum** caso para esses tipos — busca por
`Uint8|TypedArray|ArrayBuffer|Buffer|DataView|lastIndex|Error|Object(` não
retorna ocorrência.

```ts
it('clona TypedArray como TypedArray real', () => {
    const src = new Uint8Array([1, 2, 3]);
    const c = deepClone(src);
    expect(Object.prototype.toString.call(c)).toBe('[object Uint8Array]');
    expect(Array.from(c)).toEqual([1, 2, 3]);
    expect(c.buffer).not.toBe(src.buffer);
});

it('preserva lastIndex de RegExp', () => {
    const r = /a/g; r.lastIndex = 3;
    expect(deepClone(r).lastIndex).toBe(3);
});

it('preserva a mensagem de Error', () => {
    expect(deepClone(new Error('boom')).message).toBe('boom');
});
```
