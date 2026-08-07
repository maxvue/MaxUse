# Convenções de implementação

Contrato obrigatório para todos os 280 helpers da migração. Os planos individuais
em `plans/` referenciam este arquivo em vez de repetir estas regras.

## Estilo (ESLint — `eslint.config.js`)

- Indentação de **4 espaços**.
- **Aspas simples**.
- **Ponto-e-vírgula** sempre.
- **Sem trailing comma** (`comma-dangle: never`).
- `curly: multi` — corpo de uma única instrução fica inline, sem chaves:
  `if (!data) return [];`
- `object-curly-spacing: always` → `{ a, b }`.
- `arrow-parens: always` → `(x) => x`.
- Máximo de 2 linhas vazias consecutivas.
- JSDoc e comentários **em português**.

## Assinatura do helper

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue';

/**
 * <descrição em português>
 * Semelhante ao _.<nome> do Lodash.
 *
 * @param <arg> <descrição>
 * @returns <descrição>
 */
export function nome<T>(arg: MaybeRefOrGetter<T[]>, opt: number = 1): T[] {
    const data = toValue(arg);
    if (!data || data.length === 0) return [];

    // ...
}
```

### Reatividade — a regra que mais causa erro

`MaybeRefOrGetter` + `toValue()` valem **apenas para argumentos de dados**:
arrays, objetos, strings, números.

**Callbacks, iteratees e comparadores permanecem funções puras — nunca
`MaybeRefOrGetter`, nunca passam por `toValue`.** Envolver um callback em
`toValue` quebraria a chamada, porque `toValue` invocaria a função como getter
(chamando-a sem argumentos) em vez de repassá-la como predicado para o
helper usar depois.

```typescript
// certo — o array é dado (passa por toValue), o predicado é função pura
export function takeWhile<T>(array: MaybeRefOrGetter<T[]>, predicate: (v: T) => boolean): T[] {
    const data = toValue(array);
    const result: T[] = [];
    for (const item of data) {
        if (!predicate(item)) break;
        result.push(item);
    }
    return result;
}

// errado — nunca faça isto
export function takeWhile<T>(array: MaybeRefOrGetter<T[]>, predicate: MaybeRefOrGetter<(v: T) => boolean>): T[] {
    const fn = toValue(predicate); // toValue() chama a função sem argumentos e usa o retorno
    // "fn" aqui não é mais o predicado — é o que quer que o predicado tenha retornado
    // quando invocado com zero argumentos. O helper quebra em runtime.
}
```

Essa regra vale para qualquer parâmetro do tipo função: `predicate`, `iteratee`,
`comparator`, `callback`, `interceptor` etc. Se o parâmetro é chamado pelo
helper (`fn(item)`), ele é função pura. Se o parâmetro é lido como valor
(`array`, `object`, `string`, `count`), ele é `MaybeRefOrGetter` e passa por
`toValue`.

O retorno é sempre **valor plano**, nunca `ComputedRef`.

## Registro no barrel

**Fato importante, vale para as 8 categorias:** os objetos namespace
(`lang`, `functionsHelpers`, `utils`, `seq`, `Obj`, `Str`, `StrFilter`,
`StrCase`) são **cosméticos**. O objeto `_` (`src/index.ts`) e os dados de
auto-import são alimentados pelos **exports planos** de cada categoria
(`...Iterables`, `...Math` etc. em `ownHelpers`) — nunca pelo conteúdo do
namespace. **O export plano sozinho já é suficiente** para o helper chegar
em `_` e no auto-import, em qualquer categoria.

As 8 categorias reais desta migração **não seguem um padrão único** de
`index.ts`. Regra por categoria — siga o estilo de export plano já existente
no arquivo, e não invente um novo:

| Categoria    | Namespace                | Export plano — estilo real |
|--------------|---------------------------|------------------------------|
| `Lang`       | `lang`                    | `export * from './nome';` |
| `Functions`  | `functionsHelpers` (⚠️ **não** `functions` — colide com `lodash.functions`) | `export * from './nome';` |
| `Utils`      | `utils`                   | `export * from './nome';` |
| `Seq`        | `seq`                     | `export * from './nome';` |
| `Iterables`  | **NENHUM.** Não existe objeto namespace nesta categoria. | `export * from './nome';` |
| `Math`       | **NENHUM.** Não existe objeto namespace nesta categoria. | `export { nome } from './nome';` (named re-export, não `export *`) |
| `Objects`    | `Obj` — **curado e parcial**, não é exaustivo. | `import { nome } from './nome';` seguido de `export { nome, ... };` (padrão "importa-depois-exporta") |
| `Strings`    | `Str` / `StrFilter` / `StrCase` — **curados e parciais**, três objetos, nenhum exaustivo. | 6 `export * from './arquivo';` por arquivo (nem sempre 1 arquivo por helper) |

Regras de registro por grupo:

- **`Lang`, `Functions`, `Utils`, `Seq`:** atualize **os dois** — o export
  plano **e** a entrada no objeto namespace (`lang`, `functionsHelpers`,
  `utils`, `seq`). Estas 4 categorias já seguem o padrão
  `export * from './nome'; import * as nome from './nome'; export const
  <namespace> = { ...nome };` — replique exatamente esse padrão.
- **`Iterables` e `Math`:** **NÃO existe** objeto namespace nestas duas
  categorias. O export plano **sozinho** satisfaz o registro. **Não crie**
  um objeto `iterables = {...}` ou `math = {...}` — isso inventaria uma
  chave nova e não planejada no `_` (porque `export *`/`export {}` do
  namespace inventado voltaria a ser reexportado). Siga o estilo de export
  já usado no arquivo (`export *` em Iterables; `export { nome } from
  './nome';` em Math).
- **`Objects` e `Strings`:** os objetos existentes (`Obj`, `Str`,
  `StrFilter`, `StrCase`) são **curados e parciais** — não foram feitos
  para conter todo helper da categoria. **Não adicione** os novos helpers
  da migração a esses objetos. O export plano sozinho satisfaz o registro;
  siga o estilo de import-depois-export já usado em `Objects/index.ts` e o
  `export * from './arquivo';` já usado em `Strings/index.ts`.

Além do `index.ts` da categoria, toda categoria nova precisa ser registrada
em **três** pontos de agregação (ver `CLAUDE.md` da raiz do repo):
[`src/index.ts`](../src/index.ts), [`src/Helpers/maxUseItems.ts`](../src/Helpers/maxUseItems.ts)
e [`src/scripts/buildAutoImport.ts`](../src/scripts/buildAutoImport.ts). As
8 categorias desta migração (`Iterables`, `Objects`, `Strings`, `Math`,
`Lang`, `Functions`, `Utils`, `Seq`) já existem e já estão registradas nos
três — em todos os casos desta migração só é preciso mexer no `index.ts` da
categoria (mais o objeto namespace, quando ele existir).

## Teste colocalizado

Arquivo `<nome>.test.ts` ao lado do fonte. Cobertura **obrigatória**:

1. Casos de paridade com o comportamento documentado do Lodash.
2. Edge cases: `null`, `undefined`, coleção vazia, tipo errado.
3. Um caso **`funciona com Ref`** — obrigatório em todo helper que recebe
   argumento de dado:
   ```typescript
   it('funciona com Ref', () => {
       expect(nome(ref([1, 2, 3]))).toEqual(esperado);
   });
   ```
4. A peculiaridade citada no plano do helper, quando houver.

Modelo:

```typescript
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { nome } from './nome';

describe('nome', () => {
    it('faz o caso principal', () => {
        expect(nome([1, 2, 3])).toEqual(esperado);
    });

    it('retorna vazio para null', () => {
        expect(nome(null as any)).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(nome(ref([1, 2, 3]))).toEqual(esperado);
    });
});
```

## Oráculo de paridade

Enquanto `lodash-es` estiver instalado, use-o para conferir casos-limite durante
o desenvolvimento:

```typescript
import * as lodash from 'lodash-es';
expect(nome(entrada)).toEqual(lodash.nome(entrada));
```

**Estes imports são temporários.** Antes de marcar o helper como concluído,
troque a asserção pelo valor literal observado — o valor esperado precisa ficar
gravado no teste, para que ele continue válido depois que o Lodash for removido:

```typescript
// depois
expect(nome(entrada)).toEqual([1, 2, 3]);
```

Nenhum teste final pode importar `lodash-es`. É um andaime de desenvolvimento,
não parte da suite.

## Divergências intencionais

Alguns nomes já existem como helper próprio da MaxUse (ou reexportado de
VueUse) e vencem o Lodash por design — ver
[`DIVERGENCES.md`](./DIVERGENCES.md). Se o nome do helper que você está
implementando aparece nessa lista, **não** replique a semântica do Lodash:
implemente/preserve o comportamento já documentado ali.

## Comandos

```bash
npx vitest run src/Helpers/<Categoria>/<nome>.test.ts   # teste do helper
npm run lint                                            # ESLint com --fix
npm run type-check                                      # vue-tsc --noEmit
npm test                                                # suite completa
```
