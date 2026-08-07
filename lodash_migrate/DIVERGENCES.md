# Divergências intencionais em relação ao Lodash

A MaxUse já possuía implementações próprias (ou reexportadas do VueUse) para
**45** nomes que também existem no Lodash. Por decisão de design registrada em
`src/index.ts`, a ordem de precedência dentro do objeto `_` é
**helpers próprios > VueUse > Lodash**: se o nome já existe mais acima nessa
cadeia, a versão do Lodash é descartada. `_.get`, por exemplo, é o `get` da
MaxUse, não o do Lodash.

Consequência: o `_` **não é** um drop-in replacement fiel do Lodash nestes 45
nomes. Quem migra de `lodash`/`lodash-es` para `@maxvue/max-use` precisa
revisar os usos abaixo — a assinatura ou o comportamento pode diferir.

> Nota histórica: o brief original desta tarefa estimava 36 nomes. A Task 2
> acrescentou `isNil`, `negate`, `stubTrue` e `tap` a `maxUseItems()` — e
> `negate` também existe no Lodash, entre outras adições — o que elevou a
> contagem real para 45. A lista abaixo foi obtida executando o comando do
> `CONVENTIONS.md`/Step 1 do plano da Task 5 diretamente neste worktree; ela
> é a fonte de verdade, não o número do brief.

## Nomes afetados

`camelCase`, `capitalize`, `chunk`, `clamp`, `cloneDeep`, `countBy`, `filter`,
`findLast`, `first`, `get`, `groupBy`, `identity`, `invoke`, `isArray`,
`isDate`, `isEmpty`, `isEqual`, `isNil`, `isNumber`, `isObject`, `kebabCase`,
`keyBy`, `last`, `mapValues`, `negate`, `noop`, `now`, `omit`, `orderBy`,
`pick`, `sample`, `set`, `shuffle`, `size`, `snakeCase`, `sortBy`, `stubTrue`,
`sum`, `sumBy`, `tap`, `toArray`, `toNumber`, `truncate`, `uniq`, `unset`.

Origem da versão vencedora (própria MaxUse vs. VueUse) varia por nome — ambas
vencem o Lodash igualmente pela ordem de composição de `_` em `src/index.ts`.
Por exemplo, `identity`, `noop`, `clamp`, `invoke` e `toArray` chegam via
`VueUse`; os demais chegam via helpers próprios de categoria (`Lang`,
`Functions`, `Utils`, `Seq`, `Iterables`, `Objects`, `Strings`, `Math`,
`Validations` etc.).

## Diferenças conhecidas

Preencher conforme cada divergência for confirmada durante a migração. Formato:

### `<nome>`

- **Lodash:** `<assinatura>` — `<comportamento>`
- **MaxUse:** `<assinatura>` — `<comportamento>`
- **Impacto:** `<o que quebra ao migrar>`

## Como esta divergência é protegida

`src/Helpers/divergences.test.ts` calcula a lista de nomes conflitantes
dinamicamente (interseção entre `Object.keys(lodash-es)` e
`maxUseItems()`) e verifica que, dentro de `_`, nenhum desses nomes aponta
para a implementação do Lodash. Se alguém trocar a ordem de composição de `_`
em `src/index.ts` (ou remover um helper próprio deixando o Lodash vazar), o
teste falha — a divergência é intencional, não um bug a ser corrigido.

Como a lista é calculada dinamicamente a partir do código-fonte, o teste
continua correto conforme novos helpers dos 280 forem implementados: o
conjunto de nomes conflitantes só cresce (ou muda) junto com `maxUseItems()`,
sem precisar editar o teste.
