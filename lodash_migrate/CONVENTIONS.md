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

Cada categoria tem um `index.ts` que (1) reexporta cada função de forma plana
e (2) monta um objeto namespace agregando-as (padrão de
`src/Helpers/Validations/index.ts` → `validate`). **Os dois precisam ser
atualizados** ao adicionar um helper:

```typescript
export * from './nomeDoHelper';

import * as nomeDoHelper from './nomeDoHelper';

export const <namespace> = {
    ...nomeDoHelper
};
```

Namespaces por categoria (nomes exatos — usar o nome errado quebra a
precedência de `_` e o auto-import):

| Categoria    | Namespace         |
|--------------|-------------------|
| `Lang`       | `lang`            |
| `Functions`  | `functionsHelpers` (⚠️ **não** `functions` — colide com `lodash.functions`) |
| `Utils`      | `utils`           |
| `Seq`        | `seq`             |
| `Iterables`  | ver `index.ts` da categoria (padrão já existente) |
| `Objects`    | ver `index.ts` da categoria (padrão já existente) |
| `Strings`    | ver `index.ts` da categoria (padrão já existente) |
| `Math`       | ver `index.ts` da categoria (padrão já existente) |

Além do `index.ts` da categoria, toda categoria nova precisa ser registrada
em **três** pontos de agregação (ver `CLAUDE.md` da raiz do repo):
[`src/index.ts`](../src/index.ts), [`src/Helpers/maxUseItems.ts`](../src/Helpers/maxUseItems.ts)
e [`src/scripts/buildAutoImport.ts`](../src/scripts/buildAutoImport.ts). As
categorias `Lang`, `Functions`, `Utils` e `Seq` já existem e já estão
registradas nos três — na maioria dos casos desta migração só é preciso
adicionar o `export * from './nomeDoHelper'` no `index.ts` da categoria.

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
