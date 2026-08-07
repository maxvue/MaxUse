# Execução — Helpers NÃO usados nos projetos (lote único, sem pausas)

Você vai implementar, **em lote e sem parar entre os itens**, os helpers que
substituem o `lodash-es` na `@maxvue/max-use` e que **não são usados** por
nenhum projeto em `~/GitHub`. Este arquivo é autossuficiente: leia-o do início
ao fim antes de tocar em código.

Arquivo de estado desta trilha: **`lodash_migrate/status_no_use.yaml`**
(277 itens). Nunca edite `status_in_use.yaml` a partir deste protocolo, exceto
no caso de promoção descrito em "Reverificação de uso" abaixo.

## Modo de execução — leia isto primeiro

Diferente da trilha `execute_in_use.md`, aqui **não existe pausa para teste
entre itens**. Você percorre a fila inteira de uma tacada só e só para no
final, quando todos os itens estiverem finalizados (ou bloqueados). Em
concreto:

- **Não** peça confirmação humana entre um helper e o próximo.
- **Não** abra um subagente de verificação por helper (isso é o que torna a
  trilha `in_use` lenta e pausada). A verificação aqui é feita em bloco, ao
  fechar cada fase — ver "Verificação em bloco".
- **Não** commite por helper. Commite por fase (ver "Gate de fase").
- Rode `npx vitest run` do teste do helper logo após escrevê-lo — isso é o
  seu feedback loop imediato, e não conta como "pausa". Se passar, siga para
  o próximo item sem interrupção.

O único momento em que você para e devolve o controle ao humano é: (a) ao
final dos 277 itens; (b) se um item for para `Bloqueado`; ou (c) se a
reverificação de uso promover um item para a trilha `in_use`.

## Estado de partida

A migração usa um manifesto de 280 helpers (`lodash_migrate/manifest.ts`),
particionado em duas trilhas por uso real nos projetos de `~/GitHub`:

- **`status_in_use.yaml`** — 3 helpers usados (`values`, `pickBy`,
  `startCase`). Não são responsabilidade deste arquivo.
- **`status_no_use.yaml`** — 277 helpers sem uso detectado. **Esta é a sua
  fila.**

Dos 277 desta trilha, **4 já foram implementados** numa etapa anterior e já
constam como `status_execucao: Concluído` / `status_verificacao: Concluído`:

- `isNil`, `negate`, `stubTrue`, `tap`

**A sua fila de trabalho real é de 273 itens.** Não toque nesses 4: não os
re-implemente, não abra verificação para eles. O `status_no_use.yaml` já
reflete isso — pela regra de seleção eles simplesmente nunca serão escolhidos.

Não existe helper chamado `default` neste manifesto — se encontrar referência
a ele em documentação antiga, ignore-a: foi removido do escopo.

Rode até que **todos os 277** estejam `Concluído`/`Concluído` (ou
`Bloqueado`).

### Por que esta trilha vem primeiro

As 3 dependências dos helpers da trilha `in_use` moram **aqui**:

| Helper `in_use` | Depende de | Fase (nesta trilha) |
|---|---|---|
| `values` | `keys` | 2 |
| `pickBy` | `iteratee` | 3 |
| `startCase` | `words`, `upperFirst` | 3 |

Por isso **execute esta trilha antes da `execute_in_use.md`**. Quando esta
trilha fechar, `keys`, `iteratee`, `words` e `upperFirst` já estarão
`Concluído`/`Concluído` e a trilha `in_use` destrava por completo.

## Antes de começar

1. Confirme que está num worktree isolado, nunca na árvore principal:
   ```bash
   git worktree list
   ```
   Se não estiver num worktree dedicado a esta migração, crie um:
   ```bash
   git worktree add ../MaxUse-wt-lodash-migrate -b lodash-migrate
   cd ../MaxUse-wt-lodash-migrate && npm install
   ```
   Confirme com `pwd` que está dentro dele antes de editar qualquer arquivo.
2. Leia `lodash_migrate/CONVENTIONS.md` por inteiro. É o contrato de estilo,
   reatividade e teste de todos os helpers. As regras mais fáceis de violar
   por descuido:
   - `toValue()` só envolve **argumentos de dados** (arrays, objetos,
     strings, números). Callbacks/predicados/comparadores são funções puras
     e **nunca** passam por `toValue` nem recebem o tipo `MaybeRefOrGetter`.
   - O teste final **não pode importar `lodash-es`** — ele é um andaime de
     desenvolvimento. Antes de marcar o helper como `Concluído`, troque
     qualquer asserção contra `lodash.<nome>(...)` por um valor literal
     observado.
3. Leia `lodash_migrate/DIVERGENCES.md` por inteiro. Ele lista **45 nomes**
   onde a MaxUse já tem uma implementação própria (ou via VueUse) que
   **intencionalmente** vence o Lodash dentro do objeto `_`.

   Na prática, **nenhum dos 273 itens da sua fila é um desses 45 nomes**.
   A lista existe para proteger contra um risco real: você criar por engano um
   arquivo `src/Helpers/<Categoria>/<nome>.ts` que **sobrescreve ou duplica**
   um helper que já existe na MaxUse com semântica própria. Antes de criar
   qualquer arquivo novo, confira se `<nome>` já existe em `DIVERGENCES.md` ou
   já é exportado por alguma categoria — se for, pare e não sobrescreva.
4. Abra `lodash_migrate/status_no_use.yaml`. Campos por helper: `nome`,
   `categoria`, `fase`, `plano`, `depende_de`, `tentativas`,
   `status_execucao`, `status_verificacao`. No topo: `total: 277` e a lista
   `fases` (5 fases).

**Nunca rode `npx tsx lodash_migrate/generate.ts` (nem
`npm run migrate:generate`) durante a migração.** Esse script regenera
`plans/` e **reescreve o `status.yaml` original do zero**, apagando todo o
progresso. Se suspeitar que os planos ou o manifesto estão desatualizados,
**não rode o gerador** — pare e avise.

## Reverificação de uso (obrigatória, antes de implementar cada item)

Esta trilha parte da premissa de que o helper **não é usado** por nenhum
projeto. Antes de implementar, confirme essa premissa para o item escolhido.
É um passo barato e não conta como pausa.

```bash
n=<nome>
grep -rn "_\.$n\b\|\b$n(" \
  --include="*.ts" --include="*.tsx" --include="*.vue" --include="*.js" \
  ~/GitHub/AgenteDeBolso/resources ~/GitHub/engeapp/resources \
  ~/GitHub/MinhaBibliaOnline/resources ~/GitHub/MaxComponentsUi/src \
  ~/GitHub/SocialMedia/resources ~/GitHub/MaxAdmin/resources \
  ~/GitHub/mbo/resources ~/GitHub/max-big-icon-pack/src \
  2>/dev/null | grep -v node_modules | head -20
```

Interprete o resultado com cuidado — a maioria dos matches é ruído. **Só
conta como uso real** se for uma destas formas:

- `_.<nome>(...)` — chamada via objeto `_`;
- `import { <nome> } from '@maxvue/max-use'` — import explícito;
- `<namespace>.<nome>(...)` onde o namespace é da MaxUse (`validate.`,
  `format.`, `dates.`, `strings.`, `iterables.`, `objects.`, `types.`,
  `browser.`, `electrical.`);
- chamada nua `<nome>(...)` **apenas** em `AgenteDeBolso` ou `engeapp`, que
  têm `maxUseAutoImport` configurado no `vite.config.ts` — e mesmo aí, só se
  o nome não for declarado nem importado localmente naquele arquivo.

**Não conta como uso** (falsos positivos já observados nesta base):

- funções CSS dentro de `<style>`: `repeat(24, 1fr)`, `min(90%, 340px)`,
  `max(0.75rem, ...)`, `&:has(input:focus)`;
- globais nativos do JS: `isNaN`, `isFinite`, `parseInt`, `unescape`,
  `toString`;
- métodos nativos de Array/Object/Map/Set: `.map(`, `.filter(`, `.some(`,
  `.join(`, `.keys(`, `.values(`, `.has(`, `.add(`, `.remove(`;
- `reject(` de `new Promise((resolve, reject) => ...)`;
- `next(` de guarda do Vue Router;
- `.value` de refs do Vue (e `format.value`, `data.value`, etc.);
- nomes vindos de import local (`@functions/...`, `./...`, `@/...`);
- ocorrências apenas em comentários, JSDoc ou strings.

Decida:

- **A — o helper É realmente usado** → **não implemente aqui**. Promova-o:
  1. Remova o bloco do helper de `status_no_use.yaml` e decremente o `total`
     do topo do arquivo.
  2. Acrescente o bloco em `status_in_use.yaml`, incrementando o `total`,
     inserindo-o na posição que respeite a ordem de fase/dependência, e
     adicionando o campo `uso_confirmado:` com `caminho:linha (forma de uso)`.
  3. Registre a promoção em texto no relatório final e **siga para o próximo
     item** desta fila. Não pare o lote por causa disso.
- **B — o helper não é usado** → siga para "Processo de execução".

## Escolha do próximo item

Percorra `status_no_use.yaml` e selecione o **primeiro** helper que satisfaça
as três condições:

1. Pertence à **fase aberta** mais baixa (uma fase só abre quando a anterior
   fecha por completo — ver "Gate de fase");
2. Todas as suas `depende_de` estão com `status_verificacao: Concluído` (ou
   não existem como entrada neste arquivo — caso de `toNumber`, que já é
   helper próprio da MaxUse desde antes desta migração; trate qualquer
   `depende_de` ausente da mesma forma);
3. Não está `Bloqueado`.

Não siga ordem alfabética — a ordem de dependência é o que importa. O
`manifest.ts` que gerou este arquivo é topologicamente ordenado e validado por
teste, então seguir a ordem do arquivo já respeita as dependências.

## Máquina de estados

Para o item escolhido, olhe `status_execucao`:

- **`Realizando`** → alguém parou no meio. Verifique o que já existe
  (`src/Helpers/<Categoria>/<nome>.ts` e o `.test.ts`) e **continue de onde
  parou**.
- **`Aguardando`** → troque para `Realizando` e inicie a execução.
- **`Concluído`** → siga para o próximo item (nesta trilha a verificação
  individual não existe; ver "Verificação em bloco").

Grave o `status_no_use.yaml` a cada transição de estado, para que uma
interrupção não perca o progresso. Isso é gravação de arquivo, não pausa.

## Processo de execução

1. Leia o plano do helper (campo `plano`, ex.:
   `lodash_migrate/plans/Lang/isNull.md`). **O campo já vem com o caminho
   relativo à raiz do repositório** — abra-o exatamente como está gravado, sem
   prefixar nem remover nada. Todos os comandos assumem que você roda a partir
   da raiz do worktree (ex.: `/home/johnattas/GitHub/MaxUse-wt-lodash-migrate`),
   nunca de dentro de `lodash_migrate/`.
2. Leia a implementação original do Lodash como oráculo. **`lodash` (CJS) não
   está instalado — só `lodash-es` (ESM).** Use:
   ```bash
   npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).<nome>; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
   ```
   Mapeie **todos** os comportamentos observáveis, incluindo `null`,
   `undefined`, tipos errados e valores-limite.

   Alguns nomes não são funções (ex.: `templateSettings`) ou têm o corpo
   removido pelo build do `lodash-es` (ex.: `lodash` e seu alias
   `wrapperLodash`, da fase 5, que retornam string vazia em `.toString()`).
   Se a saída vier vazia, `(corpo removido pelo build do lodash-es)` ou não
   for código reconhecível, **não trate como erro de ferramenta**: consulte
   https://lodash.com/docs#<nome> e determine o comportamento empiricamente,
   chamando a função com entradas reais e observando o resultado.
3. Se o nome está em `DIVERGENCES.md`, ignore o passo acima como fonte de
   verdade — implemente/preserve a semântica da MaxUse, não a do Lodash.
4. Crie `src/Helpers/<Categoria>/<nome>.ts` seguindo o `CONVENTIONS.md`.
5. Registre no `index.ts` da categoria (re-export flat **e** objeto namespace
   — ver tabela de namespaces em `CONVENTIONS.md`).
6. Crie `src/Helpers/<Categoria>/<nome>.test.ts` com a cobertura obrigatória
   do `CONVENTIONS.md` (paridade, edge cases, caso `funciona com Ref`,
   peculiaridade do plano). Durante o desenvolvimento você pode usar
   `lodash-es` como oráculo dentro do teste, mas **antes de fechar o item,
   troque essas asserções por valores literais** — nenhum `.test.ts` final
   pode importar `lodash-es`.
7. Rode até passar:
   ```bash
   npx vitest run src/Helpers/<Categoria>/<nome>.test.ts
   ```
8. **Revise o teste em busca de brechas.** Algum comportamento do original
   ficou sem asserção? O teste passaria com uma implementação errada? Se sim,
   reforce o teste — e corrija o helper se ele estiver errado.
9. Marque `status_execucao: Concluído` e **siga imediatamente para o próximo
   item**, sem lint, sem type-check e sem commit. Esses três rodam por fase,
   não por item — é o que mantém o lote sem pausas.

## Verificação em bloco (por fase, não por item)

Ao fechar cada fase, rode a verificação de uma vez para todos os helpers que
a fase produziu:

1. Suíte completa e checagens estáticas:
   ```bash
   npm run lint && npm run type-check && npm test
   ```
2. Confirme que nenhum teste final ficou importando o oráculo:
   ```bash
   grep -rln "lodash-es" src/Helpers/ || echo "OK: nenhum teste importa lodash-es"
   ```
3. Confirme que todo helper da fase está exportado no `index.ts` da categoria
   (flat + namespace) e aparece no objeto `_`:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   const nomes = ['<nome1>', '<nome2>'];
   const falta = nomes.filter(n => !(n in _));
   console.log(falta.length ? 'FALTA: ' + falta.join(', ') : 'OK: todos em _');
   "
   ```
4. Dispare **um único subagente com modelo Opus 5** para auditar a fase
   inteira (não um por helper), com este briefing:

   > Audite os helpers da fase `<N>` da migração do Lodash, listados em
   > `lodash_migrate/status_no_use.yaml` com `fase: <N>`. Para cada um, o
   > código está em `src/Helpers/<Categoria>/<nome>.ts` e o teste em
   > `src/Helpers/<Categoria>/<nome>.test.ts`.
   >
   > Se um nome está listado em `lodash_migrate/DIVERGENCES.md`, a referência
   > de comportamento correto é a MaxUse (ou VueUse), não o Lodash — não
   > reprove por divergir do Lodash nesses casos. Caso contrário, compare com
   > o `_.<nome>` do Lodash (`lodash-es` está instalado — use-o como oráculo,
   > nunca `lodash` puro, que não está instalado). Verifique:
   > 1. Paridade de comportamento, incluindo `null`, `undefined`, coleção
   >    vazia, tipos errados e valores-limite;
   > 2. Aderência ao `lodash_migrate/CONVENTIONS.md` (estilo ESLint, JSDoc em
   >    português, `toValue` só nos argumentos de dados, callbacks intocados);
   > 3. Se algum teste tem brechas — passaria com uma implementação errada?
   > 4. Se cada helper está exportado no `index.ts` da categoria (flat +
   >    namespace);
   > 5. Se nenhum `.test.ts` final importa `lodash-es`.
   >
   > Responda com uma lista: para cada helper, APROVADO ou REPROVADO. Se
   > REPROVADO, liste os problemas concretos.

5. Para cada helper **APROVADO**, marque `status_verificacao: Concluído`.
   Para cada **REPROVADO**, incremente `tentativas`, volte
   `status_execucao: Realizando` e corrija — ainda dentro do lote, sem parar.

## Atenção ao `npm run lint`

Ele roda `eslint . --fix` no repositório inteiro, não só nos arquivos novos.
Pegadinhas conhecidas, sem relação com esta migração — **não tente
corrigi-las**:

- No estado atual do repositório, `npm run lint` já reporta **1 erro e 5
  warnings**: o único erro é `src/Helpers/Locales/pt_BR.js:149` (`Expected no
  linebreak before this statement`, regra
  `@stylistic/nonblock-statement-body-position`).
  `src/Helpers/Types/hasContent.test.ts:87` aparece só como **warning** (`_a`
  não usado). Os demais warnings vêm de arquivos em `dist/` (build antigo,
  fora do código-fonte).
- `eslint --fix` **restiliza outros arquivos não relacionados** — esperado,
  não efeito colateral do seu código. Um único `npm run lint` já reescreve
  estes **8 arquivos** (efeito da regra `curly: multi` sobre código antigo):
  `src/Composables/useDefaultReset.ts`, `src/Composables/useRefCached.ts`,
  `src/Helpers/Objects/deepMerge.ts`, `src/Helpers/maxUseItems.ts`,
  `src/Routes/apiUploadRoute.ts`, `src/Routes/config.ts`,
  `src/Routes/getCachedApi.ts`, `src/scripts/buildAutoImport.ts` (~38
  inserções / 53 remoções). Se rodar o lint e ver esse mesmo conjunto mudar,
  **não é o seu helper causando isso** — `eslint --fix` não é
  idempotente-noop aqui.

Antes de commitar o fechamento da fase, cheque `git status --short` e reverta
com `git checkout -- <arquivo>` qualquer arquivo fora do escopo (helpers da
fase, seus testes, os `index.ts` de categoria e `status_no_use.yaml`). Mantenha
o diff cirúrgico.

## Limite de tentativas

Se `tentativas` chegar a **3**, marque `status_execucao: Bloqueado`, registre
o motivo num comentário do `status_no_use.yaml` e **siga para o próximo
item**. Não gire em loop no mesmo helper — os bloqueados são revisados
manualmente ao final.

## Gate de fase

### O que conta como fase fechada

Uma fase está **fechada** quando **todo** helper nela está em um destes dois
estados — não existe um terceiro caminho:

- `status_execucao: Concluído` **e** `status_verificacao: Concluído`; ou
- `status_execucao: Bloqueado`.

**`Bloqueado` conta como fechado para fins de gate de fase.** Isso é
proposital: a regra de "Escolha do próximo item" já exclui `Bloqueado` da
seleção, então se um helper travado também impedisse o fechamento da própria
fase, a migração empacaria de vez. Leia "fecha por completo" como "todos
concluídos ou bloqueados".

### Como detectar mecanicamente que uma fase fechou

Não conte à mão. Rode a partir da raiz do repositório:

```bash
npx tsx -e "
import fs from 'node:fs';
import { load } from 'js-yaml';
const s: any = load(fs.readFileSync('lodash_migrate/status_no_use.yaml', 'utf8'));
const r: Record<string, number> = {};
for (const h of s.helpers) {
    const pend = !(h.status_execucao === 'Concluído' && h.status_verificacao === 'Concluído') && h.status_execucao !== 'Bloqueado';
    if (pend) r['fase ' + h.fase] = (r['fase ' + h.fase] || 0) + 1;
}
console.log(r);
"
```

A saída é `fase N → itens ainda pendentes`. Uma fase sem entrada no mapa está
fechada. Saída esperada no início desta trilha (com os 4 seeds já
descontados):

```
{ 'fase 1': 86, 'fase 2': 46, 'fase 3': 93, 'fase 4': 28, 'fase 5': 20 }
```

> `js-yaml` pode não estar instalado no worktree. Se o comando falhar com
> `MODULE_NOT_FOUND`, rode `npm i -D js-yaml` ou conte com um parse simples
> por regex sobre as linhas `fase:` / `status_*` do arquivo.

### Ao fechar a fase

Depois da "Verificação em bloco" passar:

```bash
git add -A src/Helpers lodash_migrate/status_no_use.yaml
git commit -m "chore: fecha a fase <N> da migração do Lodash (trilha no_use)"
```

### ⚠️ Aviso específico para a fase 5 (Seq / chaining)

**Antes de implementar qualquer um dos 20 helpers da fase 5**, pare e leia
isto. Os planos em `lodash_migrate/plans/Seq/*.md` são, cada um, escopados a
**um arquivo** (`src/Helpers/Seq/<nome>.ts`) — nenhum é dono de uma decisão de
arquitetura compartilhada. Mas os 20 helpers de `Seq` não são independentes:
`chain`, `tap`, `thru`, `value`, `commit`, `plant`, `next` e todos os
`wrapper*` giram em torno de **um único wrapper de encadeamento preguiçoso
(lazy)** — a classe/estrutura que representa o "valor encadeado" do Lodash
(equivalente ao `LodashWrapper` interno), com métodos como `.value()`,
`.commit()`, `.plant()` e `.next()`.

Isso é **design arquitetural**, não um helper isolado. Nenhum plano de
`plans/Seq/` contém esse desenho — cada um assume que o wrapper já existe e
descreve apenas o método que expõe. Se você seguir o processo normal a partir
do primeiro helper da fase 5, vai tentar construir `chain.ts` sem definir que
tipo de objeto ele retorna — e os helpers seguintes vão herdar esse projeto
malfeito ou duplicar decisões de design de forma inconsistente.

**Antes do primeiro helper individual da fase 5**, projete e implemente esse
wrapper compartilhado (onde mora, sua interface pública, como `chain(value)` o
instancia, como cada `wrapper*` se pendura nele) como um passo à parte,
cobrindo em conjunto o que os helpers de encadeamento vão precisar. Só depois
siga a máquina de estados normal para os 20 helpers de `Seq`.

Esta é a **única** parada de design permitida dentro do lote — ela é interna
ao seu próprio trabalho e não exige confirmação humana.

## Encerramento desta trilha

Quando os 277 estiverem `Concluído`/`Concluído` (ou `Bloqueado`), **não**
remova o `lodash-es` ainda: a trilha `execute_in_use.md` (3 helpers) ainda
não rodou, e o encerramento da migração pertence a ela.

Pare e reporte ao humano, em texto:

1. Quantos itens fecharam `Concluído`/`Concluído`.
2. A lista de `Bloqueado`, se houver: nome, categoria, motivo registrado no
   comentário do `status_no_use.yaml` e número de tentativas.
3. A lista de itens **promovidos** para `status_in_use.yaml` pela
   reverificação de uso, com a evidência (`caminho:linha`) de cada um.
4. Confirmação de que `keys`, `iteratee`, `words` e `upperFirst` estão
   `Concluído`/`Concluído` — são as dependências que destravam a trilha
   `in_use`:
   ```bash
   npx tsx -e "
   import fs from 'node:fs';
   import { load } from 'js-yaml';
   const s: any = load(fs.readFileSync('lodash_migrate/status_no_use.yaml', 'utf8'));
   for (const n of ['keys', 'iteratee', 'words', 'upperFirst']) {
       const h = s.helpers.find((x: any) => x.nome === n);
       console.log(n, '→', h ? h.status_execucao + '/' + h.status_verificacao : 'AUSENTE');
   }
   "
   ```

Depois disso, siga para `lodash_migrate/execute_in_use.md`.

## Regras que não podem ser quebradas

1. **Nunca** edite `src/Helpers/autoImportData.json` à mão — é gerado pelo
   `prebuild`/`src/scripts/buildAutoImport.ts`.
2. **Nunca** remova o `lodash-es` nesta trilha — o encerramento da migração
   pertence à trilha `in_use`, e o Lodash é rede de segurança e oráculo dos
   testes até lá.
3. **Nunca** envolva callbacks/iteratees/predicados/comparadores em
   `toValue`. Só argumentos de dados passam por `toValue`.
4. **Nunca** rode `npx tsx lodash_migrate/generate.ts` (nem
   `npm run migrate:generate`) enquanto houver progresso registrado — ele
   reescreve o `status.yaml` original do zero e apaga o histórico.
5. Os **45** nomes conflitantes (`lodash_migrate/DIVERGENCES.md`) mantêm a
   semântica da MaxUse. Não os "conserte" para bater com o Lodash.
6. Atualize o `status_no_use.yaml` a cada transição de estado, não só no fim.
7. Não gaste rodadas corrigindo as falhas de lint pré-existentes em
   `src/Helpers/Locales/pt_BR.js` e `src/Helpers/Types/hasContent.test.ts` —
   são anteriores a esta migração e fora de escopo.
8. **Não pare entre itens.** Pausa só ao final da fila, num `Bloqueado` ou
   numa promoção para a trilha `in_use`.
