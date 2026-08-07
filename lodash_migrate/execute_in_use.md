# Execução — Helpers USADOS nos projetos (item a item, com pausa para teste)

Você vai implementar, **um item por vez, parando para teste entre eles**, os
helpers que substituem o `lodash-es` na `@maxvue/max-use` e que **são
efetivamente usados** por projetos em `~/GitHub`. Este arquivo é
autossuficiente: leia-o do início ao fim antes de tocar em código.

Arquivo de estado desta trilha: **`lodash_migrate/status_in_use.yaml`**.

## Modo de execução — leia isto primeiro

Esta é a trilha **cuidadosa**. Cada helper aqui tem consumidor real em
produção: um erro de paridade quebra código que já roda hoje. Por isso, ao
contrário da trilha `execute_no_use.md`:

- Você implementa **um helper por vez**.
- Depois de cada helper, você **para** — roda a validação completa, dispara o
  subagente de verificação, commita, e **só então** vai para o próximo item.
- A verificação é **por helper**, não em bloco.
- O commit é **por helper**, não por fase.

A pausa entre itens é o ponto do protocolo, não um efeito colateral. Não
agrupe itens para "ganhar tempo".

## Estado de partida

A migração usa um manifesto de 280 helpers (`lodash_migrate/manifest.ts`),
particionado em duas trilhas por uso real nos projetos de `~/GitHub`:

- **`status_no_use.yaml`** — 277 helpers sem uso detectado. Rodam em lote pela
  trilha `execute_no_use.md`.
- **`status_in_use.yaml`** — **3 helpers com uso confirmado**. Esta é a sua
  fila.

| Helper | Categoria | Fase | Depende de | Uso confirmado |
|---|---|---|---|---|
| `values` | Objects | 2 | `keys` | `MinhaBibliaOnline/resources/Stores/Planner/getListPlannerListsStore.ts:126` (`_.values`) |
| `pickBy` | Objects | 3 | `iteratee` | `MinhaBibliaOnline/resources/Stores/Planner/getListPlannerListsStore.ts:126` (`_.pickBy`) |
| `startCase` | Strings | 3 | `words`, `upperFirst` | `MinhaBibliaOnline/resources/Vue/Sections/Auth/Pesquisa.vue:202` (`_.startCase`) |

O campo `uso_confirmado:` de cada item no `status_in_use.yaml` guarda essa
evidência. Trate-a como contrato: o helper precisa continuar servindo
**exatamente** esse call site depois da migração.

A trilha pode crescer: a reverificação de uso da trilha `no_use` promove para
cá qualquer helper que se revele usado. Se ao abrir o `status_in_use.yaml`
você encontrar mais de 3 itens, é isso — trate os novos como qualquer outro.

### ⚠️ Pré-requisito: rode a trilha `no_use` antes desta

As dependências dos 3 helpers moram na **outra** trilha:

| Este helper | Precisa de | Onde está |
|---|---|---|
| `values` | `keys` | `status_no_use.yaml`, fase 2 |
| `pickBy` | `iteratee` | `status_no_use.yaml`, fase 3 |
| `startCase` | `words`, `upperFirst` | `status_no_use.yaml`, fase 3 |

Confirme que as quatro estão `Concluído`/`Concluído` antes de começar:

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

Se alguma não estiver pronta, **pare**: rode `lodash_migrate/execute_no_use.md`
primeiro. Implementar `values` sem `keys` significa duplicar `keys` à mão e
divergir da implementação oficial.

> `js-yaml` pode não estar instalado no worktree. Se o comando falhar com
> `MODULE_NOT_FOUND`, rode `npm i -D js-yaml` ou confira os quatro nomes
> diretamente no arquivo.

Não existe helper chamado `default` neste manifesto — se encontrar referência
a ele em documentação antiga, ignore-a: foi removido do escopo.

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
   Se a trilha `no_use` já rodou, use **o mesmo worktree** — as dependências
   implementadas por ela precisam estar presentes.
2. Leia `lodash_migrate/CONVENTIONS.md` por inteiro. É o contrato de estilo,
   reatividade e teste. As regras mais fáceis de violar por descuido:
   - `toValue()` só envolve **argumentos de dados** (arrays, objetos,
     strings, números). Callbacks/predicados/comparadores são funções puras e
     **nunca** passam por `toValue` nem recebem o tipo `MaybeRefOrGetter`.
     Isso importa especialmente em `pickBy`, cujo segundo argumento é um
     predicado.
   - O teste final **não pode importar `lodash-es`** — ele é um andaime de
     desenvolvimento. Antes de marcar o helper como `Concluído`, troque
     qualquer asserção contra `lodash.<nome>(...)` por um valor literal
     observado.
3. Leia `lodash_migrate/DIVERGENCES.md` por inteiro. Ele lista **45 nomes**
   onde a MaxUse já tem implementação própria (ou via VueUse) que
   **intencionalmente** vence o Lodash dentro do objeto `_`. Nenhum dos 3
   itens desta fila é um desses nomes, mas confira antes de criar qualquer
   arquivo: se `<nome>` já existe em `DIVERGENCES.md` ou já é exportado por
   alguma categoria, **pare e não sobrescreva**.
4. Abra `lodash_migrate/status_in_use.yaml`. Campos por helper: `nome`,
   `uso_confirmado`, `categoria`, `fase`, `plano`, `depende_de`, `tentativas`,
   `status_execucao`, `status_verificacao`.

**Nunca rode `npx tsx lodash_migrate/generate.ts` (nem
`npm run migrate:generate`) durante a migração.** Esse script regenera
`plans/` e **reescreve o `status.yaml` original do zero**, apagando todo o
progresso. Se suspeitar que os planos ou o manifesto estão desatualizados,
**não rode o gerador** — pare e avise.

## Escolha do próximo item

Percorra `status_in_use.yaml` e selecione o **primeiro** helper que satisfaça
as três condições:

1. Pertence à **fase aberta** mais baixa;
2. Todas as suas `depende_de` estão `Concluído`/`Concluído` — aqui elas moram
   no `status_no_use.yaml`, então confira **lá** (ver o comando do
   pré-requisito acima). Trate qualquer `depende_de` que não exista em nenhum
   dos dois arquivos como já satisfeita: é o caso de `toNumber`, helper
   próprio da MaxUse desde antes desta migração;
3. Não está `Bloqueado`.

Com a fila atual, a ordem é: **`values`** (fase 2) → **`pickBy`** (fase 3) →
**`startCase`** (fase 3).

## Máquina de estados

Para o item escolhido, olhe `status_execucao`:

- **`Realizando`** → alguém parou no meio. Verifique o que já existe
  (`src/Helpers/<Categoria>/<nome>.ts` e o `.test.ts`) e **continue de onde
  parou**.
- **`Aguardando`** → troque para `Realizando` e inicie a execução.
- **`Concluído`** → olhe `status_verificacao`:
  - **`Realizando`** → a verificação foi interrompida. **Reinicie a
    verificação do zero.**
  - **`Aguardando`** → troque para `Realizando` e inicie a verificação.
  - **`Concluído`** → vá para o próximo item.

Grave o `status_in_use.yaml` a cada transição de estado, para que uma
interrupção não perca o progresso.

## Processo de execução

1. Leia o plano do helper (campo `plano`, ex.:
   `lodash_migrate/plans/Objects/values.md`). **O campo já vem com o caminho
   relativo à raiz do repositório** — abra-o exatamente como está gravado, sem
   prefixar nem remover nada. Todos os comandos assumem que você roda a partir
   da raiz do worktree (ex.: `/home/johnattas/GitHub/MaxUse-wt-lodash-migrate`),
   nunca de dentro de `lodash_migrate/`.
2. **Leia o call site real** registrado em `uso_confirmado`. Antes de
   implementar, entenda como o projeto consumidor chama o helper: que tipos
   passa, o que espera de volta, se depende de ordem de chaves, se o valor
   entra num `ref`. Esse call site vira um caso de teste obrigatório (ver
   passo 7).
3. Leia a implementação original do Lodash como oráculo. **`lodash` (CJS) não
   está instalado — só `lodash-es` (ESM).** Use:
   ```bash
   npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).<nome>; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
   ```
   Mapeie **todos** os comportamentos observáveis, incluindo `null`,
   `undefined`, tipos errados e valores-limite.

   Se a saída vier vazia, `(corpo removido pelo build do lodash-es)` ou não
   for código reconhecível, **não trate como erro de ferramenta**: consulte
   https://lodash.com/docs#<nome> e determine o comportamento empiricamente,
   chamando a função com entradas reais e observando o resultado.
4. Se o nome está em `DIVERGENCES.md`, ignore o passo acima como fonte de
   verdade — implemente/preserve a semântica da MaxUse, não a do Lodash.
5. Crie `src/Helpers/<Categoria>/<nome>.ts` seguindo o `CONVENTIONS.md`.
   Reutilize as dependências já implementadas pela trilha `no_use` (`keys`,
   `iteratee`, `words`, `upperFirst`) em vez de reimplementá-las.
6. Registre no `index.ts` da categoria (re-export flat **e** objeto namespace
   — ver tabela de namespaces em `CONVENTIONS.md`).
7. Crie `src/Helpers/<Categoria>/<nome>.test.ts` com a cobertura obrigatória
   do `CONVENTIONS.md` (paridade, edge cases, caso `funciona com Ref`,
   peculiaridade do plano) **mais um teste de regressão do call site real**:
   reproduza a forma de chamada registrada em `uso_confirmado`, com dados no
   mesmo formato do projeto consumidor, e asserte o resultado esperado.

   Durante o desenvolvimento você pode usar `lodash-es` como oráculo dentro do
   teste, mas **antes de marcar como `Concluído`, troque essas asserções por
   valores literais** — nenhum `.test.ts` final pode importar `lodash-es`.
8. Rode até passar:
   ```bash
   npx vitest run src/Helpers/<Categoria>/<nome>.test.ts
   ```
9. **Revise o teste em busca de brechas.** Algum comportamento do original
   ficou sem asserção? O teste passaria com uma implementação errada? Se sim,
   reforce o teste — e corrija o helper se ele estiver errado.
10. **Pausa para teste — a suíte inteira, não só este helper:**
    ```bash
    npm run lint && npm run type-check && npm test
    ```
    Os três precisam passar. Um helper passar no próprio teste não garante que
    o conjunto compila nem que não houve colisão de nomes no `_`.
11. Confirme que o helper chegou ao objeto `_` com a semântica certa:
    ```bash
    npx tsx -e "
    import { _ } from './src/index';
    if (!('<nome>' in _)) throw new Error('FALTA em _: <nome>');
    console.log('OK: <nome> exposto em _');
    "
    ```
12. Marque `status_execucao: Concluído` e passe para a verificação.

## Atenção ao `npm run lint`

Ele roda `eslint . --fix` no repositório inteiro, não só no arquivo novo.
Pegadinhas conhecidas, sem relação com esta migração — **não tente
corrigi-las**:

- No estado atual do repositório, `npm run lint` já reporta **1 erro e 5
  warnings**: o único erro é `src/Helpers/Locales/pt_BR.js:149` (`Expected no
  linebreak before this statement`, regra
  `@stylistic/nonblock-statement-body-position`).
  `src/Helpers/Types/hasContent.test.ts:87` aparece só como **warning** (`_a`
  não usado). Os demais warnings vêm de arquivos em `dist/` (build antigo).
- `eslint --fix` **restiliza outros arquivos não relacionados** — esperado.
  Um único `npm run lint` já reescreve estes **8 arquivos** (efeito da regra
  `curly: multi` sobre código antigo): `src/Composables/useDefaultReset.ts`,
  `src/Composables/useRefCached.ts`, `src/Helpers/Objects/deepMerge.ts`,
  `src/Helpers/maxUseItems.ts`, `src/Routes/apiUploadRoute.ts`,
  `src/Routes/config.ts`, `src/Routes/getCachedApi.ts`,
  `src/scripts/buildAutoImport.ts` (~38 inserções / 53 remoções). Se ver esse
  mesmo conjunto mudar, **não é o seu helper** — `eslint --fix` não é
  idempotente-noop aqui.

Depois de rodar o lint, cheque `git status --short`: se aparecer algo fora de
`src/Helpers/<Categoria>/<nome>.ts`, `src/Helpers/<Categoria>/<nome>.test.ts`,
`src/Helpers/<Categoria>/index.ts` e `lodash_migrate/status_in_use.yaml`,
reverta com `git checkout -- <arquivo>` antes de commitar. Mantenha o diff
cirúrgico.

## Verificação (por helper)

1. Dispare um **subagente com modelo Opus 5** com este briefing:

   > Verifique o helper `<nome>` em `src/Helpers/<Categoria>/<nome>.ts` e seu
   > teste em `src/Helpers/<Categoria>/<nome>.test.ts`.
   >
   > Este helper **tem consumidor real em produção**, registrado no campo
   > `uso_confirmado` de `lodash_migrate/status_in_use.yaml`:
   > `<uso_confirmado>`. Abra esse call site e confirme que a implementação
   > serve exatamente aquela chamada — mesmos tipos de entrada, mesmo formato
   > de retorno. Uma divergência aqui quebra código que já roda hoje.
   >
   > Se `<nome>` está listado em `lodash_migrate/DIVERGENCES.md`, a referência
   > de comportamento correto é a MaxUse (ou VueUse), não o Lodash — não
   > reprove por divergir do Lodash nesses casos. Caso contrário, compare com
   > o `_.<nome>` do Lodash (`lodash-es` está instalado — use-o como oráculo,
   > nunca `lodash` puro, que não está instalado). Verifique:
   > 1. Paridade de comportamento, incluindo `null`, `undefined`, coleção
   >    vazia, tipos errados e valores-limite;
   > 2. Aderência ao `lodash_migrate/CONVENTIONS.md` (estilo ESLint, JSDoc em
   >    português, `toValue` só nos argumentos de dados, callbacks intocados);
   > 3. Se o teste tem brechas — passaria com uma implementação errada?
   > 4. Se existe o teste de regressão do call site real e se ele de fato
   >    reproduz a chamada registrada em `uso_confirmado`;
   > 5. Se o helper está exportado no `index.ts` da categoria (flat +
   >    namespace);
   > 6. Se o `.test.ts` final **não** importa `lodash-es` (permitido só
   >    durante o desenvolvimento, não no resultado);
   > 7. Se o helper reutiliza as dependências já implementadas
   >    (`<depende_de>`) em vez de reimplementá-las à mão.
   >
   > Rode `npx vitest run src/Helpers/<Categoria>/<nome>.test.ts`,
   > `npm run lint` e `npm run type-check`. Se o `lint` alterar arquivos além
   > dos deste helper, ignore essas alterações ao avaliar (efeito colateral
   > conhecido do `eslint --fix`) — mas mencione se ocorreu.
   >
   > Responda APROVADO ou REPROVADO. Se REPROVADO, liste os problemas
   > concretos.

2. Aguarde a conclusão.
3. **Aprovado** → marque `status_verificacao: Concluído`. Antes de commitar,
   rode `git status --short` e reverta qualquer arquivo alterado pelo
   `eslint --fix` do subagente que não pertença a este helper. Então:
   ```bash
   git add src/Helpers/<Categoria>/<nome>.ts src/Helpers/<Categoria>/<nome>.test.ts src/Helpers/<Categoria>/index.ts lodash_migrate/status_in_use.yaml
   git commit -m "feat: implementa <nome> (migração Lodash, trilha in_use)"
   ```
   **Só agora vá para o próximo item.**
4. **Reprovado** → incremente `tentativas`, volte `status_execucao` para
   `Realizando` e corrija os problemas apontados.

## Limite de tentativas

Se `tentativas` chegar a **3**, marque `status_execucao: Bloqueado`, registre
o motivo num comentário do `status_in_use.yaml` e **pare** — não siga para o
próximo item calado. Um `Bloqueado` nesta trilha é mais grave que na trilha
`no_use`: significa que um helper com consumidor real em produção ficou sem
implementação própria. Reporte ao humano antes de continuar.

## Encerramento da migração

Esta trilha é a **última** a rodar, então o encerramento da migração inteira
pertence a ela.

### Pré-condições

Só prossiga quando **as duas trilhas** estiverem fechadas, sem nenhum
`Bloqueado` em qualquer uma delas:

```bash
npx tsx -e "
import fs from 'node:fs';
import { load } from 'js-yaml';
for (const f of ['status_in_use.yaml', 'status_no_use.yaml']) {
    const s: any = load(fs.readFileSync('lodash_migrate/' + f, 'utf8'));
    const pend = s.helpers.filter((h: any) => !(h.status_execucao === 'Concluído' && h.status_verificacao === 'Concluído'));
    const bloq = s.helpers.filter((h: any) => h.status_execucao === 'Bloqueado');
    console.log(f, '→ total:', s.helpers.length, '| pendentes:', pend.length, '| bloqueados:', bloq.length);
    for (const b of bloq) console.log('   BLOQUEADO:', b.nome, '(' + b.categoria + ')');
}
"
```

A soma dos dois arquivos precisa dar **280**. Se **algum** helper estiver
`Bloqueado`, **não execute o encerramento**. Remover o `lodash-es` quebraria
em runtime qualquer consumidor desse helper — ele nunca ganhou implementação
própria, e hoje é servido pelo Lodash via `_`. Em vez disso: pare, liste em
texto todos os `Bloqueado` (nome, categoria, motivo registrado no comentário
do YAML, número de tentativas) e reporte ao humano. A decisão de como resolver
cada bloqueio é humana, não automática.

### Passos

1. Remova os imports de `lodash-es` que sobraram nos testes (o oráculo de
   paridade), substituindo as asserções por valores literais. Faça isto
   **antes** de desinstalar o pacote — os testes ainda importam `lodash-es` e
   você precisa rodá-los para confirmar a reescrita antes de remover a
   dependência que os sustenta:
   ```bash
   grep -rln "lodash-es" src/ lodash_migrate/
   ```
   Exceção — reescreva em vez de simplesmente apagar o import, porque ambos
   dependem do Lodash para calcular a lista de nomes conflitantes:
   - `src/Helpers/divergences.test.ts` — troque o cálculo dinâmico (hoje
     `Object.keys(lodash).filter(...)`) por uma lista estática dos 45 nomes de
     `DIVERGENCES.md` (seção "Nomes afetados").
   - `lodash_migrate/manifest.test.ts` — mesma lógica: qualquer verificação
     que importe `lodash-es` para conferir o manifesto precisa passar a usar
     dados estáticos (o próprio `manifest.ts`, que já é a fonte de verdade).

   Além disso, **mesmo não importando `lodash-es` e portanto não aparecendo no
   grep acima**, revise `src/Helpers/precedence.test.ts`: o título do teste
   ("mantém os helpers exclusivos do Lodash disponíveis") e o JSDoc partem da
   premissa de que existem nomes que só o Lodash fornece. Depois deste
   encerramento isso deixa de ser verdade — os 276 nomes agora são
   implementações próprias da MaxUse. O teste continua passando tecnicamente,
   mas o nome e o comentário descrevem uma situação que não existe mais.
   Reescreva título e JSDoc antes de commitar.
2. Rode a suíte para confirmar as reescritas do passo 1 **enquanto o
   `lodash-es` ainda está instalado**:
   ```bash
   npm test
   ```
3. Remova o Lodash de `src/index.ts` ([src/index.ts](../src/index.ts)):
   apague a linha `import * as lodash from 'lodash-es';` e todo o bloco
   `filteredLodash` (comentário, declaração e laço), deixando o objeto `_`
   assim:
   ```typescript
   export const _ = {
       ...ownHelpers,
       ...filteredVueUse
   };
   ```
4. Só agora remova `lodash-es` das dependências:
   ```bash
   npm uninstall lodash-es @types/lodash-es
   ```
5. Regenere os dados de auto-import (script gerador — **nunca edite
   `src/Helpers/autoImportData.json` à mão**):
   ```bash
   npx tsx src/scripts/buildAutoImport.ts
   ```
6. Validação final:
   ```bash
   npm run lint && npm run type-check && npm test && npm run build
   ```
7. Confirme que o `_` expõe os nomes esperados — incluindo os 3 desta trilha,
   que têm consumidor real:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   console.log('total em _:', Object.keys(_).length);
   for (const n of ['values', 'pickBy', 'startCase', 'isNil', 'negate', 'stubTrue', 'tap', 'compact', 'chunk', 'debounce'])
       if (!(n in _)) throw new Error('FALTA: ' + n);
   console.log('OK');
   "
   ```
8. **Teste de fumaça nos consumidores reais.** Antes de integrar, confirme que
   os call sites registrados em `uso_confirmado` continuam corretos. Para cada
   um, reproduza a chamada com os dados do projeto e compare com o
   comportamento anterior:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   // MinhaBibliaOnline/.../getListPlannerListsStore.ts:126
   const cards = { a: { done: true }, b: { done: false } };
   console.log(_.values(_.pickBy(cards, (c: any) => c.done)));
   // MinhaBibliaOnline/.../Pesquisa.vue:202
   console.log(_.startCase('são josé dos campos').toUpperCase());
   "
   ```
9. Commit e integre no `main`:
   ```bash
   git add -A
   git commit -m "feat!: remove a dependência do lodash-es"
   cd /home/johnattas/GitHub/MaxUse
   git merge lodash-migrate
   ```

## Regras que não podem ser quebradas

1. **Nunca** edite `src/Helpers/autoImportData.json` à mão — é gerado pelo
   `prebuild`/`src/scripts/buildAutoImport.ts`.
2. **Nunca** remova o `lodash-es` antes das **duas trilhas** fecharem (280 no
   total, zero `Bloqueado`) — ele é a rede de segurança e o oráculo dos testes
   durante o desenvolvimento.
3. **Nunca** envolva callbacks/iteratees/predicados/comparadores em `toValue`.
   Só argumentos de dados passam por `toValue` — atenção ao predicado de
   `pickBy`.
4. **Nunca** rode `npx tsx lodash_migrate/generate.ts` (nem
   `npm run migrate:generate`) enquanto houver progresso registrado — ele
   reescreve o `status.yaml` original do zero e apaga o histórico.
5. Os **45** nomes conflitantes (`lodash_migrate/DIVERGENCES.md`) mantêm a
   semântica da MaxUse. Não os "conserte" para bater com o Lodash.
6. Atualize o `status_in_use.yaml` a cada transição de estado, não só no fim.
7. Não gaste rodadas corrigindo as falhas de lint pré-existentes em
   `src/Helpers/Locales/pt_BR.js` e `src/Helpers/Types/hasContent.test.ts` —
   são anteriores a esta migração e fora de escopo.
8. **Pare entre itens.** Rodar a suíte completa, verificar e commitar antes de
   pegar o próximo helper é o protocolo desta trilha, não um extra opcional.
9. **Nunca** apague o campo `uso_confirmado` de um item — ele é a evidência de
   por que o helper está nesta trilha e a base do teste de regressão.
