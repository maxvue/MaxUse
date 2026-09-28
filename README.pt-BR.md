<p align="center">
  <img src="https://raw.githubusercontent.com/maxvue/MaxUse/main/maxvue.jpeg" alt="MaxUse Logo" width="120" />
</p>

<h1 align="center">@maxvue/max-use</h1>

<p align="center">
  <strong>A biblioteca de utilitários definitiva para Vue 3</strong><br/>
  VueUse + Helpers customizados estilo Lodash — com suporte total a reatividade.
</p>

<p align="center">
  🌐 <strong>Português (Brasil)</strong> | <a href="README.md">English</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@maxvue/max-use"><img src="https://img.shields.io/npm/v/@maxvue/max-use.svg?style=flat-square&color=41b883" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@maxvue/max-use"><img src="https://img.shields.io/npm/dm/@maxvue/max-use.svg?style=flat-square&color=41b883" alt="downloads" /></a>
  <a href="https://github.com/maxvue/MaxUse/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@maxvue/max-use.svg?style=flat-square" alt="license" /></a>
  <img src="https://img.shields.io/badge/Vue-3.x-41b883?style=flat-square&logo=vue.js" alt="vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript" alt="typescript" />
  <img src="https://img.shields.io/badge/tree--shaking-✓-brightgreen?style=flat-square" alt="tree-shaking" />
</p>

---

## ✨ Por que MaxUse?

| Recursos | Lodash puro | VueUse puro | **MaxUse** |
|:---|:---:|:---:|:---:|
| Reatividade nativa do Vue 3 (`toValue`) | ❌ | ✅ | ✅ |
| Utilitários completos de arrays, objetos e funções | ✅ | ❌ | ✅ (nativos TS) |
| Composables avançados (storage, debounce, spellchecker) | ❌ | ✅ | ✅ |
| Validações brasileiras (CPF, CNPJ, CEP, Cartão, Telefone) | ❌ | ❌ | ✅ |
| Formatação pt-BR (moeda BRL, documentos, máscaras) | ❌ | ❌ | ✅ |
| Integração HTTP com rotas nomeadas (Ziggy / Laravel / Adonis) | ❌ | ❌ | ✅ |
| Cache HTTP em `localStorage` e `IndexedDB` (Stale-While-Revalidate) | ❌ | ❌ | ✅ |
| API unificada (`_`) sem dependência do `lodash-es` | ✅ | ❌ | ✅ |
| Tree-shaking granular + 18 submódulos | ⚠️ | ✅ | ✅ |
| Preset de Auto Import para `unplugin-auto-import` | ❌ | ✅ | ✅ |

---

## 📦 Instalação

```bash
<<<<<<< HEAD
npm install @maxvue/max-use @vueuse/core vue
```

# npm
npm install @maxvue/max-use @vueuse/core vue

# pnpm
pnpm add @maxvue/max-use @vueuse/core vue

# yarn
yarn add @maxvue/max-use @vueuse/core vue

# bun
bun add @maxvue/max-use @vueuse/core vue
```

> **Módulo Routes (Opcional):** Se utilizar navegação SPA e rotas nomeadas com Ziggy / Laravel em `@maxvue/max-use/routes`, instale também:
> ```bash
> npm install vue-router ziggy-js
> ```

---

## 🚀 Como Usar

### 1. Importação Individual (Recomendado para Tree-Shaking)

```ts
import { isString, isWeekend, capitalize, deepMerge, formatCurrency } from '@maxvue/max-use'

const preco = formatCurrency(1250.5) // "R$ 1.250,50"
```

### 2. O Objeto Centralizado (`_`)

A MaxUse disponibiliza o objeto `_` que agrupa todos os helpers próprios da biblioteca, as funções do **VueUse** e as reimplementações de estilo **Lodash**, priorizando a MaxUse em colisões de nome.

> **Importante (v2.0.0):** A MaxUse não depende mais de `lodash-es`. Todos os utilitários clássicos (`debounce`, `throttle`, `groupBy`, `sum`, `get`, `set`, etc.) são reimplementações nativas em TypeScript, otimizadas para reatividade do Vue.

```ts
import { _ } from '@maxvue/max-use'

<<<<<<< HEAD
// Helpers nativos da MaxUse
const id = _.intervalRandom(1, 10)
const merged = _.deepMerge({ a: 1 }, { b: 2 })

// Composables do VueUse integrados
const { x, y } = _.useMouse()

// Funções estilo Lodash
const debounced = _.debounce(fn, 300)
```

#### Divergências conhecidas em relação ao Lodash

Diferenças **deliberadas** de comportamento travadas por testes de caracterização:

| Helper | MaxUse | Lodash | Motivo |
|:---|:---|:---|:---|
| `sum` | `sum([6, 4, NaN])` → `10`<br/>`sum(['1', '2'])` → `3` | `NaN`<br/>`'12'` | Coercitivo (`parseFloat`): dados não numéricos viram `0`. Nunca retorna `NaN`. Aceita `Ref` e `Record`. |
| `sumBy` | `sumBy([{ a: '10' }, { a: '5' }], 'a')` → `15` | `'105'` | Mesma coerção: `Number(valor) \|\| 0`. Nunca retorna `NaN`. |
| `orderBy` | Nulos e `undefined` sempre ao final | Nulos no início em `'desc'` | Consistência de visualização em tabelas e formulários: dados ausentes sempre vão para o final. |
| `deepMerge` | Clona profundamente instâncias (`Date`, `Map`, `Set`) | Preserva instâncias por referência | Evita vazamento de referências e mutação acidental entre objetos mesclados. |
| `isEmpty` | `isEmpty(0) === false`<br/>`isEmpty(false) === false` | `true`<br/>`true` | Em formulários, `0` e `false` são valores válidos preenchidos e não devem ser tratados como vazios. |
| `size` | `size(42) === 42` (com `allow_number: true`) | `0` | Ergonomia para contadores e tamanhos numéricos. |
| `filter` | Em `Record<string, T>`, retorna `Record<string, T>` | Retorna `T[]` (perde chaves) | Preserva a estrutura de dicionário indexado. |

### 3. Importação por Submódulos

Para otimizar o bundle, importe diretamente das categorias:

```ts
import { isTouchDevice, getColorFromVar } from '@maxvue/max-use/browser'
import { addTime, isWeekend, isPast }       from '@maxvue/max-use/dates'
import { first, uniqueBy, groupBy }         from '@maxvue/max-use/iterables'
import { average, median }                  from '@maxvue/max-use/math'
import { deepMerge, renameKeys }            from '@maxvue/max-use/objects'
import { truncate, readingTime, slugify }    from '@maxvue/max-use/strings'
import { isBlank, hasContent, isNumber }     from '@maxvue/max-use/types'
import { isCpf, isEmail, cepIsValid }       from '@maxvue/max-use/validations'
import { formatCurrency, formatBytes }       from '@maxvue/max-use/format'
import { wireSize }                          from '@maxvue/max-use/electrical'
import { useRefCached, useTimeAgo }          from '@maxvue/max-use/composables'
import { apiGetRoute, goToRoute }            from '@maxvue/max-use/routes'
```

### 4. Acesso ao VueUse completo

```ts
import { vueUse } from '@maxvue/max-use'

// Todos os exports do @vueuse/core, sem filtros
const { useMouse, useStorage, useClipboard } = vueUse
=======
// Helpers nativos MaxUse
const id = _.intervalRandom(1, 10)
const total = _.sum([10, '20', null]) // 30 (coerção segura)

// Composables integrados do VueUse
const { x, y } = _.useMouse()

// Utilitários de função estilo Lodash
const debounced = _.debounce(() => console.log('salvo'), 300)
>>>>>>> fa510a82 (docs: atualizar documentação completa, sincronizar submódulos e preparar release v2.0.0)
```

---

<<<<<<< HEAD
## 🔀 Diferenças conhecidas em relação ao Lodash

### Placeholder de `partial` / `curry` / `bind`

No Lodash o placeholder é o próprio `_`, porque lá `_` **é a função da biblioteca**. Na MaxUse, `_` é um **objeto agregador de helpers** — não é chamável e não há `export default`. Por isso o placeholder é um `Symbol` dedicado, exportado como `placeholder` e também disponível em `partial.placeholder`, `partialRight.placeholder`, `curry.placeholder`, `curryRight.placeholder`, `bind.placeholder` e `bindKey.placeholder` — todos o **mesmo** símbolo.

```ts
import { curry, placeholder } from '@maxvue/max-use'

const fn = (a, b, c) => [a, b, c]

curry(fn)(1, placeholder, 3)(2) // ✅ [1, 2, 3]
curry(fn)(1, _, 3)              // ❌ o objeto _ vira o valor de b, sem erro
```

> **Migrando código de Lodash:** troque todo `_` em posição de placeholder por `placeholder`. A troca é textual e **não há erro em tempo de execução avisando** — o `_` passa como argumento real e a função executa silenciosamente com o valor errado.

### `_` é um objeto, não uma função

No Lodash o mesmo valor serve de namespace (`_.map`) e de wrapper chamável (`_([1,2,3])`). Aqui `_` é apenas o objeto agrupador — `_(valor)` lança `TypeError`. Para encadear, use as funções dedicadas:

```ts
import { _, chain, wrapperLodash } from '@maxvue/max-use'

_.max([1, 2, 3])              // ✅ 3
// _([1, 2, 3]).max()         // ❌ TypeError: _ is not a function

chain([1, 2, 3]).max().value()          // ✅ 3 (encadeamento explícito)
wrapperLodash([1, 2, 3]).max().value()  // ✅ 3 (encadeamento implícito)
```

### O wrapper sempre exige `.value()`

No Lodash, o wrapper implícito desembrulha sozinho em métodos terminais (`max`, `min`, `sum`, `mean`, `head`, `last`, `get`). Na MaxUse **todos** os métodos retornam o wrapper, e o valor primitivo só sai com `.value()`:

```ts
wrapperLodash([1, 2, 3]).max()          // MaxUseWrapper, não 3
wrapperLodash([1, 2, 3]).max().value()  // 3
```

O wrapper implementa `valueOf()` e `toJSON()`, então aritmética, comparação relacional e serialização continuam funcionando sem `.value()` — mas `typeof` e a comparação estrita `===` **não**:

```ts
const w = wrapperLodash([1, 2, 3]).max()

w > 2                 // true
w + 1                 // 4
JSON.stringify(w)     // "3"

typeof w              // 'object'  (no Lodash seria 'number')
w === 3               // false     — use w.value() === 3
```

Na dúvida, chame `.value()` ao final de qualquer cadeia.

---

## ⚡ Reatividade como Princípio

Diferente de bibliotecas utilitárias comuns, **toda função da MaxUse entende a reatividade do Vue**. Você pode passar valores puros, `Refs`, `Computeds` ou funções `getter` — internamente, `toValue()` é utilizado para resolver o valor.

```ts
import { ref, computed } from 'vue'
import { isPast, isWeekend, capitalize } from '@maxvue/max-use'

// ✅ Funciona com Refs
const date = ref(new Date('2020-01-01'))
const isExpired = computed(() => isPast(date))

// ✅ Funciona com Getters
const weekend = computed(() => isWeekend(() => new Date()))

// ✅ Funciona com valores primitivos
capitalize('hello') // 'Hello'
```

> **Convenção de tipo:** Todos os parâmetros utilizam `MaybeRefOrGetter<T>` — o tipo nativo do Vue que aceita `T | Ref<T> | (() => T)`.

---

## 📖 Referência Completa da API

### 🌐 Browser

Funções para detecção de ambiente e interação com o navegador.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `isTouchDevice` | `() → boolean` | Detecta se o dispositivo suporta interações via toque |
| `getColorFromVar` | `(colorVar: string) → string` | Obtém o valor computado de uma CSS Variable do `:root` |

```ts
import { isTouchDevice, getColorFromVar } from '@maxvue/max-use/browser'

if (isTouchDevice()) {
  console.log('Dispositivo touch detectado')
}

// Aceita tanto '--cor' quanto 'var(--cor)'
const cor = getColorFromVar('--primary-color') // '#41b883'
```

---

### 📅 Dates

Manipulação, verificação e cálculo de diferenças entre datas.

#### Verificações

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `isDate` | `(valor) → boolean` | Verifica se o valor é uma data válida |
| `isPast` | `(dateValue) → boolean` | Verifica se a data já passou |
| `isFuture` | `(dateValue) → boolean` | Verifica se a data está no futuro |
| `isWeekend` | `(dateValue) → boolean` | Verifica se cai em sábado ou domingo |
| `isSameDay` | `(dates[], operator?) → boolean` | Verifica se as datas são do mesmo dia |
| `inDateInterval` | `(value, { start, end? }) → boolean` | Verifica se a data está dentro de um intervalo |
| `hasPassedMinutes` | `(dateValue, minutes?) → boolean` | Se já se passaram N minutos desde a data |
| `hasPassedHours` | `(dateValue, hours?) → boolean` | Se já se passaram N horas desde a data |
| `hasPassedDays` | `(dateValue, days?) → boolean` | Se já se passaram N dias desde a data |

#### Manipulação

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `now` | `() → number` | Timestamp atual em milissegundos |
| `addTime` | `(date, amount, unit?) → Date \| null` | Adiciona/subtrai tempo a uma data |

```ts
import { addTime } from '@maxvue/max-use/dates'

addTime('2025-01-01', 30, 'days')    // Date: 31 de janeiro
addTime(new Date(), -2, 'hours')     // 2 horas atrás
addTime(date_ref, 1, 'year')         // Aceita Refs!
```

> **Unidades suportadas:** `'days'`, `'months'`, `'years'`, `'hours'`, `'minutes'`, `'seconds'` (singular também funciona).

#### Diferenças entre datas

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `diffInSeconds` | `(date1, date2) → number` | Diferença absoluta em segundos |
| `diffInMinutes` | `(date1, date2) → number` | Diferença absoluta em minutos |
| `diffInHours` | `(date1, date2) → number` | Diferença absoluta em horas |
| `diffInDays` | `(date1, date2) → number` | Diferença absoluta em dias |
| `diffInMonths` | `(date1, date2) → number` | Diferença absoluta em meses |
| `diffInYears` | `(date1, date2) → number` | Diferença absoluta em anos |

#### Tempo decorrido

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `secondsAgo` | `(date) → number` | Quantos segundos se passaram |
| `minutesAgo` | `(date) → number` | Quantos minutos se passaram |
| `hoursAgo` | `(date) → number` | Quantas horas se passaram |
| `daysAgo` | `(date) → number` | Quantos dias se passaram |
| `monthsAgo` | `(date) → number` | Quantos meses se passaram |
| `yearsAgo` | `(date) → number` | Quantos anos se passaram |

---

### 🔢 Iterables

Manipulação de arrays, coleções e objetos iteráveis.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `first` | `(array) → T \| undefined` | Retorna o primeiro elemento |
| `last` | `(array) → T \| undefined` | Retorna o último elemento |
| `chunk` | `(array, size) → T[][]` | Divide o array em pedaços de tamanho fixo |
| `uniq` | `(array) → T[]` | Remove itens duplicados (primitivos) |
| `uniqueBy` | `(array, key) → T[]` | Remove duplicatas por propriedade ou função seletora |
| `groupBy` | `(collection, iteratee?) → Record<string, T[]>` | Agrupa elementos por chave/iteratee (suporta caminhos profundos e shorthands) |
| `keyBy` | `(collection, iteratee?) → Record<string, T>` | Indexa a coleção por chave/iteratee (suporta caminhos profundos e shorthands) |
| `countBy` | `(collection, iteratee) → Record<string, number>` | Conta ocorrências por grupo |
| `countWhere` | `(collection, key, value?) → number` | Conta itens cuja propriedade é igual ao valor (padrão `true`) |
| `orderBy` | `(collection, criteria?, orders?) → T[]` | Ordena por critérios/iteratees e direções (suporta objetos e tuplas) |
| `orderByWithKey` | `(collection, criteria, object_keyBy, order?) → Record<string, T>` | Ordena por critérios e indexa o resultado por uma chave |
| `filter` | `(collection, predicate?) → T[] \| Record<string, T>` | Filtra elementos com predicado/iteratee (suporta shorthands) |
| `filterBy` | `(collection, key, value) → T[]` | Filtra por valor de uma propriedade |
| `filterByNot` | `(collection, key, value) → T[]` | Filtra excluindo um valor de propriedade |
| `findLast` | `(collection, predicate?, fromIndex?) → T \| undefined` | Encontra o último elemento que satisfaz o predicado/iteratee |
| `sum` | `(array) → number` | Soma todos os valores numéricos ([veja divergências](#divergências-conhecidas-em-relação-ao-lodash)) |
| `sumBy` | `(collection, iteratee?) → number` | Soma valores de uma propriedade (inclusive aninhada com notação de ponto) ou derivada por iteratee ([veja divergências](#divergências-conhecidas-em-relação-ao-lodash)) |
| `sample` | `(array) → T` | Retorna um elemento aleatório |
| `shuffle` | `(array) → T[]` | Embaralha os elementos |
| `size` | `(value) → number` | Tamanho de arrays, strings, objetos, Maps, Sets |
| `objectSize` | `(value) → number` | Quantidade de chaves de um objeto |
| `valuesInKey` | `(collection, key) → any[]` | Extrai todos os valores de uma chave |

```ts
import { groupBy, uniqueBy, orderBy, first } from '@maxvue/max-use/iterables'

const users = [
  { id: 1, name: 'Ana', role: 'admin' },
  { id: 2, name: 'João', role: 'user' },
  { id: 3, name: 'Maria', role: 'admin' }
]

groupBy(users, 'role')       // { admin: [...], user: [...] }
uniqueBy(users, 'role')      // [{ id: 1, ... }, { id: 2, ... }]
orderBy(users, ['name'])     // Ordenado por nome
first(users)                 // { id: 1, name: 'Ana', ... }
```

> **`filter` e entradas nulas.** Como no Lodash, `filter(null)`, `filter(undefined)` e
> valores primitivos devolvem `[]` — nunca lançam. A diferença deliberada da MaxUse é o
> caso de **Record**: enquanto `_.filter` do Lodash sempre devolve array, aqui um objeto
> indexado devolve um Record com as chaves originais preservadas.
>
> ```ts
> filter(null, () => true)                                  // []
> filter({ a: { v: 1 }, b: { v: 2 } }, (i) => i.v > 1)      // { b: { v: 2 } }
> ```
>
> **`countBy` e `countWhere`.** Para total alinhamento com o Lodash, `countBy(collection, iteratee)`
> agrupa e conta ocorrências retornando um `Record<string, number>`.
> Se você precisa contar itens cuja propriedade seja igual a um determinado valor (comportamento anterior do `countBy`),
> utilize `countWhere(collection, key, value = true)`.
>
> ```ts
> countBy([6.1, 4.2, 6.3], Math.floor)       // { '4': 1, '6': 2 }
> countBy(['one', 'two', 'three'], 'length') // { '3': 2, '5': 1 }
> countWhere(users, 'active')                // 2 (contagem de itens onde item.active === true)
> countWhere(users, 'role', 'admin')         // 2 (contagem de itens onde item.role === 'admin')
> ```

---

### 🧮 Math

Cálculos estatísticos e arredondamento.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `average` | `(numbers: number[]) → number` | Média aritmética |
| `median` | `(numbers: number[]) → number` | Mediana (resistente a outliers) |
| `roundUp` | `(value, decimals?) → number` | Arredondamento para cima |
| `roundDown` | `(value, decimals?) → number` | Arredondamento para baixo |

```ts
import { average, median } from '@maxvue/max-use/math'

average([10, 20, 30])           // 20
median([1, 2, 3, 100])          // 2.5 (ignora outlier)
```

---

### 📦 Objects

Manipulação profunda de objetos.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `deepClone` | `(value) → T` | Cópia profunda (Date, Map, Set, refs circulares) |
| `deepMerge` | `(target, ...sources) → T` | Merge profundo de objetos |
| `get` | `(object, path, defaultValue?) → any` | Acesso seguro por caminho (dot notation) |
| `set` | `(object, path, value) → void` | Define valor por caminho (dot notation) |
| `unset` | `(object, path) → boolean` | Remove propriedade por caminho |
| `isEqual` | `(value1, value2) → boolean` | Comparação profunda de igualdade |
| `diff` | `(object1, object2) → object` | Retorna as diferenças entre dois objetos |
| `renameKeys` | `(object, keyMap) → object` | Renomeia chaves de um objeto |
| `pick` | `(object, keys) → object` | Seleciona apenas as chaves indicadas |
| `omit` | `(object, keys) → object` | Remove as chaves indicadas |
| `mapValues` | `(object, fn) → object` | Transforma os valores de um objeto (`null`/`undefined` → `{}`) |

> **Alias:** `cloneDeep` é um alias para `deepClone`.

```ts
import { deepMerge, get, pick, diff } from '@maxvue/max-use/objects'

// Merge de configs
const config = deepMerge(defaults, userConfig)

// Acesso seguro a dados aninhados
const city = get(user, 'address.city', 'Desconhecida')

// Selecionar campos
const summary = pick(user, ['id', 'name', 'email'])

// Comparar objetos
const changes = diff(oldData, newData)
```

#### Objeto agrupador `Obj`

```ts
import { Obj } from '@maxvue/max-use/objects'

Obj.deepClone(data)
Obj.get(obj, 'a.b')
Obj.set(obj, 'a.b', 42)
Obj.isEqual(a, b)
Obj.diff(a, b)
```

---

### ✏️ Strings

Transformação, análise, geração e filtragem de texto.

#### Manipulações

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `truncate` | `(value, limit?, suffix?) → string` | Encurta texto com reticências |
| `slugify` | `(value) → string` | Converte para URL-friendly slug |
| `stripHtml` / `noHtml` | `(value) → string` | Remove todas as tags HTML |
| `initials` | `(value, limit?) → string` | Extrai iniciais de um nome (`"João Silva"` → `"JS"`) |
| `readingTime` | `(value, wpm?) → string` | Tempo estimado de leitura |

#### Conversão de Case

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `capitalize` | `(value) → string` | Primeira letra maiúscula, resto minúsculo |
| `snakeCase` | `(value) → string` | `meuTexto` → `meu_texto` |
| `kebabCase` | `(value) → string` | `meuTexto` → `meu-texto` |
| `camelCase` | `(value) → string` | `meu_texto` → `meuTexto` |

#### Filtros

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `onlyLetters` | `(value, space?) → string` | Mantém apenas letras |
| `onlyNumbers` | `(value, space?) → string` | Mantém apenas números |
| `onlySymbols` | `(value) → string` | Mantém apenas símbolos |
| `onlyLettersAndNumbers` | `(value, space?) → string` | Mantém apenas alfanuméricos |
| `removeSpaces` | `(value) → string` | Remove todos os espaços |

#### Conversores

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `toSearchableString` | `(value) → string` | Normaliza para busca (sem acentos, minúsculo) |
| `toNumber` | `(value, decimals?) → number` | Converte para número com arredondamento opcional |

#### Geração

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `Random` | `(length?, type?) → string` | Gera string aleatória configurável |
| `ulid` | `() → string` | Gera um ULID (ordenável por tempo) |
| `intervalRandom` | `(min?, max?) → number` | Gera número inteiro aleatório no intervalo |

```ts
import { Random, ulid, truncate, slugify, initials } from '@maxvue/max-use/strings'

Random(10, 'upper number')  // 'A8K3M2P1X9'
Random('ulid')              // '01hy4z3f0g...' (ULID)
ulid()                      // '01hy4z3f0g...'

truncate('Texto muito longo para exibir aqui', 20) // 'Texto muito longo pa...'
slugify('Olá Mundo! É aqui.') // 'ola-mundo-e-aqui'
initials('João Victor Silva') // 'JS'
```

#### Objetos agrupadores

```ts
import { Str, StrFilter, StrCase } from '@maxvue/max-use/strings'

Str.truncate(text, 50)
Str.ulid()
StrFilter.onlyNumbers('abc123')     // '123'
StrCase.camelCase('hello_world')    // 'helloWorld'
```

---

### 🔍 Types

Verificação de tipos e estados de valores.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `isBlank` | `(value, ifZero?) → boolean` | Verifica se está vazio/nulo/undefined |
| `hasContent` | `(value, ifZero?) → boolean` | Inverso de `isBlank` — verifica se tem conteúdo |
| `isObject` | `(value) → boolean` | Verifica se é um objeto (objetos, arrays, funções) |
| `isArray` | `(value) → boolean` | Verifica se é um Array |
| `isNumber` | `(value) → boolean` | Verifica se é um número válido |
| `canIterate` | `(value) → boolean` | Verifica se é iterável (`Symbol.iterator`) |

```ts
import { isBlank, hasContent, isNumber } from '@maxvue/max-use/types'

isBlank('')           // true
isBlank(null)         // true
isBlank(0)            // true  (0 é considerado blank por padrão)
isBlank(0, true)      // false (ifZero = true: 0 tem conteúdo)
hasContent([1, 2, 3]) // true
isNumber('42')        // true
isNumber('abc')       // false
```

> **Aliases:** `blank` → `isBlank`, `isNumeric` / `numeric` → `isNumber`, `isIterable` → `canIterate`.

---

### ✅ Validations

Validação de dados comuns, com foco em documentos brasileiros.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `isCpf` | `(value) → boolean` | Valida CPF (algoritmo completo) |
| `isCnpj` | `(value) → boolean` | Valida CNPJ (algoritmo completo) |
| `isCpfCnpj` | `(value) → boolean` | Valida CPF ou CNPJ automaticamente |
| `isEmail` | `(value) → boolean` | Valida formato de e-mail |
| `cepIsValid` | `(value) → boolean` | Valida CEP brasileiro |
| `phone` | `(value) → boolean` | Valida telefone (via `libphonenumber-js`) |
| `isValid` | `(value) → boolean` | Verifica se não é `null` nem `undefined` |
| `isNotValid` | `(value) → boolean` | Inverso de `isValid` |
| `isEmpty` | `(value) → boolean` | Verifica se o tamanho é 0 |
| `isNotEmpty` | `(value) → boolean` | Verifica se o tamanho é > 0 |

```ts
import { isCpf, isEmail, cepIsValid } from '@maxvue/max-use/validations'

isCpf('123.456.789-09')    // true ou false (validação real)
isEmail('user@email.com')  // true
cepIsValid('01001-000')    // true
```

> **Aliases abundantes:** Cada função possui múltiplos aliases para conveniência ergonômica (ex: `cpfIsValid`, `isValidCpf`, `validCpf`, `hasValidCpf`). Use o que for mais natural para seu projeto.

#### Objeto agrupador `validate`

```ts
import { validate } from '@maxvue/max-use/validations'

validate.isCpf('123.456.789-09')
validate.isEmail('user@email.com')
validate.phone('+5511999999999')
validate.cepIsValid('01001-000')
```

---

### 🎨 Format

Formatadores de exibição para o mercado brasileiro.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `formatCurrency` | `(value) → string` | Formata como moeda brasileira (`R$ 1.234,56`) |
| `formatBytes` | `(bytes, decimals?) → string` | Converte bytes para legível (`1.5 MB`) |
| `formatCep` | `(value) → string` | Aplica máscara de CEP (`12345-678`) |
| `formatCpf` | `(value) → string` | Aplica máscara de CPF (`123.456.789-09`) |
| `formatCnpj` | `(value) → string` | Aplica máscara de CNPJ |
| `formatCpfCnpj` | `(value) → string` | Máscara de CPF ou CNPJ (automático) |
| `formatPhone` | `(value) → string` | Máscara de telefone brasileiro |
| `maskSensitive` | `(value, type?) → string` | Ofusca dados sensíveis (LGPD) |

```ts
import { formatCurrency, formatBytes, formatPhone, maskSensitive } from '@maxvue/max-use/format'

formatCurrency(1234.5)                  // 'R$ 1.234,50'
formatBytes(1536000)                    // '1.46 MB'
formatPhone('11999887766')              // '(11) 99988-7766'
maskSensitive('user@email.com', 'email') // 'u***@e***.com'
maskSensitive('4532015112830366', 'card') // '**** **** **** 0366'
```

#### Objeto agrupador `format`

```ts
import { format } from '@maxvue/max-use/format'

format.currency(1500)
format.bytes(2048)
format.cpf('12345678909')
format.phone('11999887766')
format.sensitive('dados', 'text')
```

---

### ⚡ Electrical

Funções de domínio para cálculos de dimensionamento elétrico conforme a norma brasileira **NBR 5410**.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `wireSize` | `async (current, options?) → Promise<WireSizeResult \| null>` | Dimensiona a bitola de cabos por capacidade de condução de corrente e limite de queda de tensão |
| `calculaCabo` | `async (current, options?) → Promise<WireSizeResult \| null>` | Alias em português para `wireSize` |

```ts
import { wireSize } from '@maxvue/max-use/electrical'

// Dimensionar cabo para 32A, 220V, circuito de 25m e queda máxima de 4%
const result = await wireSize(32, {
  voltage: 220,
  length: 25,
  max_loss: 4,
  material: 'copper', // 'copper' | 'aluminum'
  isolation: 'pvc'    // 'pvc' (70°C) | 'epr' / 'xlpe' (90°C)
})

console.log(result?.wire)         // Bitola recomendada em mm² (ex: 6)
console.log(result?.max_current)  // Capacidade de corrente admissível (A)
console.log(result?.voltage_drop) // Queda de tensão em Volts (V)
console.log(result?.loss_percent) // Queda percentual (ex: 1.78%)
```


---

## 🔧 Composables

Composables reativos para uso em componentes Vue.

### `useRefCached` / `useStorage`

Cria uma `Ref` automaticamente sincronizada com o `localStorage`, com suporte a sincronização entre abas via evento `storage`.

```ts
import { useRefCached } from '@maxvue/max-use'

// O valor persiste no localStorage com a chave 'theme'
const theme = useRefCached('theme', 'dark')

// A chave pode ser reativa!
const userId = ref(1)
const prefs = useRefCached(() => `prefs-${userId.value}`, { sidebar: true })
```

> **Aliases:** `useRefStorage`, `useCached`, `useSharedCache`, `useStorage`

---

### `useDefaultReset` / `refAutoReset`

Cria uma `Ref` com valor padrão que pode ser resetada a qualquer momento. Opcionalmente, reseta automaticamente após um timer.

```ts
import { useDefaultReset } from '@maxvue/max-use'

// Ref resetável manualmente
const form = useDefaultReset({ name: '', email: '' })
form.value.name = 'João'
form.reset() // { name: '', email: '' }

// Com auto-reset após 3 segundos
const notification = useDefaultReset('', 3000)
notification.value = 'Salvo com sucesso!'
// Após 3s → volta para ''
```

> **Mágica de IDs:** Se `initialData` contiver `id: 'ulid'`, um novo ULID é gerado a cada reset. Se contiver `created_at: 'now'`, a data atual é inserida.

---

### `useTimeAgo`

Exibe tempo relativo em **Português do Brasil**, com múltiplos formatos.

```ts
import { useTimeAgo } from '@maxvue/max-use'

const timeAgo = useTimeAgo('2025-01-01')        // Ref reativa: "5 meses"
const abbrev  = useTimeAgo(date, 'abbrev')       // "5 M"
const action  = useTimeAgo(deadline, 'action')   // "Atrasado: 3 dias"
const limit   = useTimeAgo(date, 'limitAbbrev')  // "Ontem" / "Amanhã"
```

| Formato | Uso | Exemplo |
|:---|:---|:---|
| `'br'` (padrão) | Texto completo em pt-BR | `"Mês passado"`, `"3 dias"` |
| `'abbrev'` | Abreviado | `"1 mês"`, `"3 sem."` |
| `'action'` | Contexto de tarefas/prazos | `"Atrasado: 3 dias"`, `"Realizar até amanhã"` |
| `'limit'` | Prazo com contexto | `"Atrasado (Ontem)"`, `"Realizar em 3 dias"` |
| `'limitAbbrev'` | Prazo abreviado | `"Hoje"`, `"Em 3 dias"` |

---

### `useDateFormat`

Formata datas com fallback seguro para valores inválidos.

```ts
import { useDateFormat } from '@maxvue/max-use'

const formatted = useDateFormat('2025-06-15', 'DD/MM/YYYY') // Ref: "15/06/2025"
const time = useDateFormat(date_ref, 'HH:mm')               // Ref reativa
```

---

### `useSpellChecker`

Composable reativo para verificação e correção ortográfica em tempo real (em português do Brasil e termos técnicos de engenharia fotovoltaica e elétrica).

```ts
import { ref } from 'vue'
import { useSpellChecker } from '@maxvue/max-use/composables'

const text = ref('homologacao de projeto na consessionaria')
const { errors, hasErrors, suggestions, getCorrectedText, checkNow, applySuggestion } = useSpellChecker(text, {
  debounceMs: 300,
  technicalTerms: true // Inclui vocabulário técnico de energia solar e elétrica
})

console.log(hasErrors.value)         // true
console.log(getCorrectedText())      // 'homologação de projeto na concessionária'
```

| Opção | Tipo | Padrão | Descrição |
|:---|:---|:---:|:---|
| `debounceMs` | `number` | `300` | Tempo de espera (ms) para execução da checagem |
| `technicalTerms` | `boolean` | `true` | Inclui termos de engenharia solar e homologação |
| `customDictionary` | `Record<string, string \| string[]>` | `{}` | Dicionário personalizado de termos adicionais |
| `immediate` | `boolean` | `true` | Executa a verificação imediatamente na montagem |

---

### `useCachedApi`

Cache reativo com sincronização automática de API (via rotas Ziggy).

```ts
import { useCachedApi } from '@maxvue/max-use'

// Carrega do localStorage imediatamente, depois sincroniza da API
const users = useCachedApi<User[]>('api.users.index', {
  defaultValue: [],
  data_get: { active: true },
  key: 'users-cache'
})
```

| Opção | Tipo | Descrição |
|:---|:---|:---|
| `defaultValue` | `T` | Valor padrão enquanto carrega |
| `data_get` / `data` | `MaybeRefOrGetter<object>` | Parâmetros reativos para a rota |
| `key` | `MaybeRefOrGetter<string \| null>` | Chave do storage. Se `null`, desativa o cache de storage |
| `sync` | `boolean` | Se deve buscar da API (padrão: `true`) |
| `watch` | `boolean` | Se deve observar mudanças e salvar (padrão: `true`) |

> **Aliases:** `useRefCachedApi`, `useSharedCacheApi`, `useInCacheApi`

---

### Watchers Inteligentes

| Composable | Descrição |
|:---|:---|
| `watchTrue` | Executa callback apenas quando a fonte é truthy (alias do VueUse `whenever`) |
| `watchIfValid` | Executa callback apenas quando a fonte tem conteúdo válido (não vazio) |
| `watchDebounceIfValid` | Mesmo que `watchIfValid`, mas com debounce |

```ts
import { watchIfValid, watchDebounceIfValid } from '@maxvue/max-use'

// Executa só quando selectedUser tiver conteúdo
watchIfValid(selectedUser, (user) => {
  loadUserDetails(user.id)
})

// Com debounce de 500ms
watchDebounceIfValid(searchQuery, (query) => {
  fetchResults(query)
}, { debounce: 500 })
```

> **Aliases:** `watchValid`, `watchIsValid`, `watchDebouncedValid`, `watchDebouncedIsValid`

---

## 🛤️ Routes — Integração Ziggy / Laravel / REST

Módulo completo para integração com **Laravel + Inertia/Vue**, rotas nomeadas do **Ziggy** e requisições HTTP RESTful com Axios e IndexedDB.

### Setup Obrigatório

Para utilizar as rotas nomeadas da API, configure o resolvedor do Ziggy no ponto de entrada da sua aplicação (`main.ts`):

```ts
// main.ts
import { setRouteResolver, setLibraryRouter, setApiRequestConfig } from '@maxvue/max-use/routes'
import { route } from 'ziggy-js'
import router from './router'

// 1. Configurar resolvedor de rotas Ziggy (OBRIGATÓRIO para chamadas api*Route)
setRouteResolver(route)

// 2. Configurar router para navegação (OBRIGATÓRIO para goToRoute)
setLibraryRouter(router)

// 3. Configurações globais opcionais da API
setApiRequestConfig({
  headers: {
    Authorization: () => `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
})
```

### Funções de Rota

| Função | Método HTTP | Descrição |
|:---|:---:|:---|
| `apiGetRoute<T>` | GET | Requisição GET tipada para rota nomeada (suporta download de arquivos com `file: true`) |
| `apiPostRoute<T>` | POST | Requisição POST para rota nomeada (suporta `options.route_params` para URLs com ID) |
| `apiPutRoute<T>` | PUT | Requisição PUT para rota nomeada com body e parâmetros |
| `apiDeleteRoute<T>` | DELETE | Requisição DELETE para rota nomeada com payload opcional |
| `apiUploadRoute<T>` | POST | Envio multipart com FormData automático e progresso (`onUploadProgress`) |
| `apiRoute` | Base | Função genérica de resolução de rota e opções com Axios |
| `getCachedApi<T>` | GET | GET com cache no localStorage e TTL |
| `clearCachedApi` | — | Invalidação e limpeza manual de chaves em cache no localStorage |
| `getCachedApiIDB<T>` | GET | Cache persistente em **IndexedDB** com estratégia *Stale-While-Revalidate* |
| `postCachedApiIDB<T>` | POST | Cache de requisições POST pesadas em IndexedDB |
| `clearCacheIDB` | — | Limpa o banco IndexedDB de cache |
| `getRoute` | — | Retorna a URL string de uma rota nomeada |
| `goToRoute` | — | Navega para uma rota nomeada via Vue Router |

```ts
import {
  apiGetRoute,
  apiPostRoute,
  apiPutRoute,
  apiDeleteRoute,
  apiUploadRoute,
  getCachedApiIDB,
  goToRoute
} from '@maxvue/max-use/routes'

// 1. GET tipado com query params
const users = await apiGetRoute<User[]>('api.users.index', { status: 'active' })

// 2. PUT em rota RESTful com parâmetro de URL e body separados
await apiPutRoute('api.users.update', { name: 'Novo Nome' }, {
  route_params: { user: 42 }
})

// 3. Upload multipart com callback de progresso
await apiUploadRoute('api.documents.upload', fileInstance, { category: 'solar' }, {
  onUploadProgress: (e) => console.log(`Progresso: ${Math.round((e.loaded / e.total) * 100)}%`)
})

// 4. Cache IndexedDB (Offline-first / Stale-While-Revalidate)
const projects = await getCachedApiIDB('api.projects.all', null, 'all-projects', 3600, (freshData) => {
  // Callback executado caso a API retorne dados mais recentes que o cache
  console.log('Dados atualizados em background:', freshData)
})

// 5. Navegação
goToRoute('projects.show', { id: 42 })
=======
## 🛠️ Configuração de Rotas (`@maxvue/max-use/routes`)

O submódulo de rotas oferece um cliente HTTP declarativo baseado em nomes de rotas (Laravel/Ziggy/Adonis), com suporte a cache em `localStorage` e `IndexedDB`.

### Setup Inicial Obrigatório

```ts
// main.ts ou app.ts
import { createApp } from 'vue'
import { setLibraryRouter, setRouteResolver, setApiRequestConfig } from '@maxvue/max-use/routes'
import { route } from 'ziggy-js' // ou seu provedor de rotas
import router from './router'
import App from './App.vue'

const app = createApp(App)

// 1. Conecta o Vue Router para navegações com goToRoute()
setLibraryRouter(router)

// 2. Conecta o resolvedor de rotas nomeadas (OBRIGATÓRIO para apiGetRoute, getRoute, etc.)
setRouteResolver((name, params) => {
    try {
        return route(name, params)
    } catch {
        return null
    }
})

// 3. (Opcional) Configura cabeçalhos globais e cookies para requisições com autenticação
setApiRequestConfig({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': () => {
            const token = localStorage.getItem('token')
            return token ? `Bearer ${token}` : ''
        }
    }
})

app.use(router).mount('#app')
```

### Utilização das Requisições

```ts
import { 
    apiGetRoute, 
    apiPostRoute, 
    apiPutRoute, 
    getCachedApi, 
    getCachedApiIDB 
} from '@maxvue/max-use/routes'

// GET simples
const usuarios = await apiGetRoute('api.usuarios.index', { page: 1 })

// POST com corpo
await apiPostRoute('api.usuarios.store', { nome: 'Maria', email: 'maria@email.com' })

// PUT com parâmetro de rota na URL e corpo
await apiPutRoute('api.usuarios.update', { nome: 'Maria Silva' }, {
    route_params: { id: 42 }
})

// Cache rápido no localStorage (TTL de 5 minutos)
const configs = await getCachedApi('api.configuracoes', {}, 'app_configs', 5 * 60 * 1000)

// Cache persistente em IndexedDB com Stale-While-Revalidate
const catalogo = await getCachedApiIDB('api.catalogo.produtos', {}, 'catalogo_produtos', 60 * 60 * 1000)
>>>>>>> fa510a82 (docs: atualizar documentação completa, sincronizar submódulos e preparar release v2.0.0)
```

---

<<<<<<< HEAD
## ⚡ Submódulos Utilitários Adicionais

A MaxUse inclui submódulos dedicados para atender a todos os cenários de desenvolvimento:

- **Functions (`@maxvue/max-use/functions`):** Utilitários de controle de execução: `debounce`, `throttle`, `memoize`, `once`, `curry`, `partial`, `after`, `before`, `delay`, `defer`, `rearg`, `flip`, `negate`, `overArgs`, `rest`, `spread`, `unary`, `wrap`, e o símbolo `placeholder`.
- **Seq (`@maxvue/max-use/seq`):** Encadeamento funcional lazy: `chain(valor).tap(fn).thru(fn).value()`.
- **Lang (`@maxvue/max-use/lang`):** Verificação e coerção de tipos: `castArray`, `clone`, `cloneDeep`, `cloneWith`, `cloneDeepWith`, `isPlainObject`, `isEqualWith`, `isMatch`, `toPath`, `toLength`, `toString`.
- **Utils (`@maxvue/max-use/utils`):** Auxiliares funcionais: `uniqueId`, `range`, `rangeRight`, `times`, `attempt`, `cond`, `conforms`, `conformsTo`, `template`, `templateSettings`.

---

## 🧩 Auto Import

A MaxUse oferece integração nativa com `unplugin-auto-import`. Com uma única configuração, **todos os helpers e composables** ficam disponíveis globalmente sem imports manuais, com tipagem TypeScript gerada automaticamente.
=======
## ⚡ Auto Import (`unplugin-auto-import`)

Para utilizar todos os helpers e composables automaticamente sem precisar de imports manuais:
>>>>>>> fa510a82 (docs: atualizar documentação completa, sincronizar submódulos e preparar release v2.0.0)

```ts
// vite.config.ts
import { defineConfig } from 'vite'
<<<<<<< HEAD
=======
import vue from '@vitejs/plugin-vue'
>>>>>>> fa510a82 (docs: atualizar documentação completa, sincronizar submódulos e preparar release v2.0.0)
import AutoImport from 'unplugin-auto-import/vite'
import { maxUseAutoImport } from '@maxvue/max-use'

export default defineConfig({
<<<<<<< HEAD
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        ...maxUseAutoImport,
      ],
      dts: 'auto-imports.d.ts' // Gera os tipos para o TypeScript e VS Code
    })
  ]
})
```


Com isso, todas as funções podem ser usadas diretamente nos componentes:

```vue
<script setup>
// Nenhum import necessário!
const formatted = formatCurrency(price)
const valid = isCpf(document)
const ago = useTimeAgo(createdAt)
</script>
```

> `maxUseAutoImport` é um **array de presets** (não uma função): espalhe-o com `...` dentro de `imports`. Ele traz a lista completa de exports gerada no build, mantendo tudo sempre sincronizado com as atualizações da biblioteca.

---

## 📋 Resumo dos Submódulos

| Submódulo | Import Path | Conteúdo |
|:---|:---|:---|
| **Browser** | `@maxvue/max-use/browser` | `getColorFromVar`, `contrastColor`, `isTouchDevice` |
| **Dates** | `@maxvue/max-use/dates` | `addTime`, `diffInDays`, `isSameDay`, `isWeekend`, `isDate`, `now`, `formatMailDate` |
| **Electrical** | `@maxvue/max-use/electrical` | `wireSize`, `calculaCabo` (Cálculo NBR 5410 com tabelas dinâmicas) |
| **Format** | `@maxvue/max-use/format` | `formatCurrency`, `formatBytes`, `formatCpf`, `formatCnpj`, `formatPhone`, `maskSensitive` |
| **Functions** | `@maxvue/max-use/functions` | `debounce`, `throttle`, `memoize`, `once`, `curry`, `partial`, `placeholder`, etc. |
| **Iterables** | `@maxvue/max-use/iterables` | `first`, `last`, `chunk`, `groupBy`, `keyBy`, `orderBy`, `orderByWithKey`, `sum`, `sumBy`, `uniq`, etc. |
| **Lang** | `@maxvue/max-use/lang` | `castArray`, `clone`, `cloneDeep`, `isPlainObject`, `isEqualWith`, type guards |
| **Math** | `@maxvue/max-use/math` | `average`, `median`, `round`, `floor`, `ceil`, `inRange`, `clamp`, `random` |
| **Objects** | `@maxvue/max-use/objects` | `deepMerge`, `deepClone`, `get`, `set`, `omit`, `pick`, `renameKeys`, `diff`, `has`, etc. |
| **Routes** | `@maxvue/max-use/routes` | `apiGetRoute`, `apiPostRoute`, `apiPutRoute`, `apiDeleteRoute`, `apiUploadRoute`, `getCachedApiIDB`, `setRouteResolver`, `goToRoute` |
| **Seq** | `@maxvue/max-use/seq` | `chain`, `tap`, `thru`, `wrapperChain` |
| **Strings** | `@maxvue/max-use/strings` | `truncate`, `slugify`, `readingTime`, `kebabCase`, `camelCase`, `snakeCase`, `mask`, `abbrevName` |
| **Types** | `@maxvue/max-use/types` | `isBlank`, `hasContent`, `isArray`, `isObject`, `isNumber`, `canIterate` |
| **Utils** | `@maxvue/max-use/utils` | `uniqueId`, `range`, `times`, `attempt`, `cond`, `conforms`, `template` |
| **Validations** | `@maxvue/max-use/validations` | `isCpf`, `isCnpj`, `cepIsValid`, `phone`, `isValidCreditCard`, `isEmail`, `isEmpty` |
| **Composables** | `@maxvue/max-use/composables` | `useSpellChecker`, `useCachedApi`, `useRefCached`, `useDefaultReset`, `useTimeAgo`, `useDateFormat`, `watchTrue` |
| **VueUse** | `@maxvue/max-use/vueuse` | Re-export completo sem filtros do `@vueuse/core` |

---

## 💻 Desenvolvimento Local

```bash
# Instala as dependências
npm install

# Executa todos os testes unitários (Vitest)
npm test

# Executa testes incluindo checagem estática de tipos
npm run test:all

# Verificação estática de tipos (vue-tsc)
npm run type-check

# Linter de código e formatação
npm run lint

# Inicia o playground interativo em http://localhost:5173
npm run dev:playground

# Compila a biblioteca (prebuild + bundles em dist/)
npm run build
```

---

## 🤝 Contribuindo

Para instruções de desenvolvimento local, execução de testes, checagem de tipos e padrões de PR, consulte o nosso guia [CONTRIBUTING.md](CONTRIBUTING.md).

Para visualizar o histórico de versões e alterações detalhadas da v2, consulte o [CHANGELOG.md](CHANGELOG.md).

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

