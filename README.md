<p align="center">
  <img src="https://raw.githubusercontent.com/maxvue/MaxUse/main/maxvue.jpeg" alt="MaxUse Logo" width="120" />
</p>

<h1 align="center">@maxvue/max-use</h1>

<p align="center">
  <strong>A biblioteca de utilitários definitiva para Vue 3</strong><br/>
  VueUse + Lodash + Helpers customizados — com suporte total a reatividade.
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

| | Lodash puro | VueUse puro | **MaxUse** |
|:---|:---:|:---:|:---:|
| Reatividade Vue nativa | ❌ | ✅ | ✅ |
| Helpers utilitários (strings, arrays, objetos) | ✅ | ❌ | ✅ |
| Composables (watchers, storage, time ago) | ❌ | ✅ | ✅ |
| Validações brasileiras (CPF, CNPJ, CEP, telefone) | ❌ | ❌ | ✅ |
| Formatação pt-BR (moeda, documentos, máscaras) | ❌ | ❌ | ✅ |
| Integração Ziggy/Laravel (rotas nomeadas) | ❌ | ❌ | ✅ |
| API unificada (`_`) | ✅ | ❌ | ✅ |
| Tree-shaking + submódulos | ⚠️ | ✅ | ✅ |
| Auto Import (`unplugin-auto-import`) | ❌ | ✅ | ✅ |

A **MaxUse** combina o melhor dos dois mundos em uma única dependência, adicionando um ecossistema completo de helpers voltados para o mercado brasileiro e projetos Laravel + Vue.

---

## 📦 Instalação

```bash
npm install @maxvue/max-use @vueuse/core @vueuse/integrations vue
```

> **Módulo Routes (Ziggy/Laravel):** Se utilizar `@maxvue/max-use/routes`, instale também:
> ```bash
> npm install ziggy-js vue-router
> ```

---

## 🚀 Como Usar

### 1. Importação Individual (Recomendado)

```ts
import { isString, isWeekend, capitalize, deepMerge } from '@maxvue/max-use'

const text = 'hello'
if (isString(text)) {
  console.log(capitalize(text)) // Hello
}
```

### 2. O Objeto Centralizado (`_`)

Para manter a conveniência do padrão Lodash, a MaxUse exporta o objeto `_`. Ele agrupa **todos os helpers próprios**, as funções do **VueUse** e do **Lodash**, priorizando a MaxUse em caso de conflitos.

```ts
import { _ } from '@maxvue/max-use'

// Helpers nativos da MaxUse
const id = _.intervalRandom(1, 10)
const merged = _.deepMerge({ a: 1 }, { b: 2 })

// Composables do VueUse integrados
const { x, y } = _.useMouse()

// Funções do Lodash
const debounced = _.debounce(fn, 300)
```

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
```

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
| `groupBy` | `(collection, iteratee) → Record<string, T[]>` | Agrupa elementos por chave |
| `keyBy` | `(collection, key) → Record<string, T>` | Indexa a coleção por uma chave |
| `countBy` | `(collection, iteratee) → Record<string, number>` | Conta ocorrências por grupo |
| `orderBy` | `(collection, keys, orders?) → T[]` | Ordena por múltiplas chaves e direções |
| `orderByWithKey` | `(collection, key, order?) → T[]` | Ordena por uma chave específica |
| `filter` | `(collection, predicate) → T[]` | Filtra elementos com predicado |
| `filterBy` | `(collection, key, value) → T[]` | Filtra por valor de uma propriedade |
| `filterByNot` | `(collection, key, value) → T[]` | Filtra excluindo um valor de propriedade |
| `findLast` | `(array, predicate) → T \| undefined` | Encontra o último elemento que satisfaz o predicado |
| `sum` | `(array) → number` | Soma todos os valores numéricos |
| `sumBy` | `(array, key) → number` | Soma valores de uma propriedade específica |
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
| `mapValues` | `(object, fn) → object` | Transforma os valores de um objeto |

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
maskSensitive('user@email.com', 'email') // 'use***@ema***.com'
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

Funções de domínio para cálculos de engenharia elétrica.

| Função | Assinatura | Descrição |
|:---|:---|:---|
| `wireSize` | `(params) → result` | Calcula dimensionamento de cabos elétricos |
| `calculaCabo` | `(params) → result` | Alias para `wireSize` |

```ts
import { electrical } from '@maxvue/max-use/electrical'

electrical.wireSize(/* parâmetros de cálculo */)
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

### `useCachedApi`

Cache reativo com sincronização automática de API (via rotas Ziggy).

```ts
import { useCachedApi } from '@maxvue/max-use'

// Carrega do localStorage imediatamente, depois atualiza da API
const users = useCachedApi<User[]>('api.users.index', {
  defaultValue: [],
  data_get: { active: true }
})
```

| Opção | Tipo | Descrição |
|:---|:---|:---|
| `defaultValue` | `T` | Valor padrão enquanto carrega |
| `data_get` / `data` | `object` | Parâmetros para a rota |
| `key` | `string` | Chave personalizada do localStorage |
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

## 🛤️ Routes — Integração Ziggy/Laravel

Módulo opcional para projetos **Laravel + Inertia/Vue** que utilizam o **Ziggy** para rotas nomeadas.

### Setup Obrigatório

```ts
// main.ts ou app.ts
import { setLibraryRouter } from '@maxvue/max-use/routes'
import router from './router'

setLibraryRouter(router) // Necessário para goToRoute funcionar
```

### Funções de Rota

| Função | Método | Descrição |
|:---|:---|:---|
| `getRoute` | — | Gera a URL de uma rota nomeada Ziggy |
| `goToRoute` | — | Navega para uma rota nomeada via Vue Router |
| `apiGetRoute` | GET | Requisição GET para rota nomeada |
| `apiPostRoute` | POST | Requisição POST para rota nomeada |
| `apiPutRoute` | PUT | Requisição PUT para rota nomeada |
| `apiDeleteRoute` | DELETE | Requisição DELETE para rota nomeada |
| `apiUploadRoute` | POST | Upload de arquivo para rota nomeada |
| `getCachedApi` | GET | GET com cache no localStorage |

```ts
import { apiGetRoute, apiPostRoute, goToRoute, getRoute } from '@maxvue/max-use/routes'

// Buscar dados
const users = await apiGetRoute('api.users.index', { page: 1 })

// Enviar dados
await apiPostRoute('api.users.store', { name: 'João', email: 'j@e.com' })

// Navegar
goToRoute('projects.show', { id: 42 })

// Obter URL
const url = getRoute('api.users.index') // '/api/users'
```

---

## 🧩 Auto Import

A MaxUse oferece integração nativa com `unplugin-auto-import`. Com uma única chamada, **todos os helpers e composables** ficam disponíveis globalmente sem imports manuais.

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { maxUseAutoImport } from '@maxvue/max-use'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        ...maxUseAutoImport,
      ]
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

| Submódulo | Import Path | Exports |
|:---|:---|:---|
| **Browser** | `@maxvue/max-use/browser` | 2 funções |
| **Dates** | `@maxvue/max-use/dates` | 19 funções |
| **Iterables** | `@maxvue/max-use/iterables` | 21 funções |
| **Math** | `@maxvue/max-use/math` | 4 funções |
| **Objects** | `@maxvue/max-use/objects` | 11 funções + `Obj` |
| **Strings** | `@maxvue/max-use/strings` | 18 funções + `Str`, `StrFilter`, `StrCase` |
| **Types** | `@maxvue/max-use/types` | 6 funções |
| **Validations** | `@maxvue/max-use/validations` | 10+ funções + `validate` |
| **Format** | `@maxvue/max-use/format` | 8 funções + `format` |
| **Electrical** | `@maxvue/max-use/electrical` | 2 funções + `electrical` |
| **Composables** | `@maxvue/max-use/composables` | 6 composables |
| **Routes** | `@maxvue/max-use/routes` | 9 funções |
| **VueUse** | `@maxvue/max-use/vueuse` | Re-export completo do `@vueuse/core` |

---

## 🤝 Contribuindo

### Padrão para novos helpers

1. **Reatividade obrigatória:** Use `MaybeRefOrGetter<T>` para todos os parâmetros de entrada.
2. **Resolução de valor:** Utilize `toValue(arg)` internamente — **nunca** `unref()`.
3. **Documentação:** Adicione JSDoc completo em **pt-BR** para todas as funções.
4. **Exports:** Registre a função no `index.ts` da categoria correspondente.
5. **Aliases:** Crie aliases ergonômicos quando fizer sentido (verbo-substantivo e substantivo-verbo).

### Estrutura de diretórios

```
src/
├── Composables/       # Composables reativos (use*)
├── Helpers/
│   ├── Browser/       # Detecção de ambiente
│   ├── Dates/         # Manipulação de datas
│   ├── Electrical/    # Cálculos elétricos
│   ├── Format/        # Formatadores de exibição
│   ├── Iterables/     # Arrays e coleções
│   ├── Math/          # Estatísticas e arredondamento
│   ├── Objects/       # Objetos e deep operations
│   ├── Strings/       # Texto e geração
│   ├── Types/         # Verificação de tipos
│   ├── Validations/   # Validação de dados
│   └── VueUse/        # Re-export do VueUse
├── Routes/            # Integração Ziggy/Laravel
└── index.ts           # Entry point principal
```

### Template de função

```ts
import { toValue, type MaybeRefOrGetter } from 'vue'

/**
 * Descrição da função em pt-BR.
 *
 * @param param1 Descrição do parâmetro.
 * @returns Descrição do retorno.
 */
export function minhaFuncao(
  param1: MaybeRefOrGetter<string>
): string {
  const data = toValue(param1)
  // Implementação...
  return data
}
```

---

## 📄 Licença

**MIT License** © [MaxVue](https://github.com/maxvue)
