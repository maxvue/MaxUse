# Execução — Independência do Lodash

Você vai implementar, em loop, os helpers que substituem o `lodash-es` na
`@maxvue/max-use`. Este arquivo é autossuficiente: leia-o do início ao fim
antes de tocar em código. Você não tem (nem precisa de) nenhum outro contexto
além do que está aqui e nos arquivos que ele referencia.

## Estado de partida — leia isto antes de tudo

A migração usa um manifesto de **280 helpers** (`lodash_migrate/manifest.ts`).
Destes, **4 já foram implementados** numa etapa anterior do projeto e já estão
gravados em `lodash_migrate/status.yaml` como `status_execucao: Concluído` e
`status_verificacao: Concluído`:

- `isNil`, `negate`, `stubTrue`, `tap`

**A sua fila de trabalho real é de 276 itens** — todos os outros. Não toque
nesses 4: não os re-implemente, não abra chamados de verificação para eles.
O `status.yaml` já reflete isso; basta segui-lo (ver "Escolha do próximo
item" abaixo — os 4 concluídos simplesmente nunca serão selecionados).

Não existe helper chamado `default` neste manifesto — se você encontrar
qualquer referência a ele em documentação antiga, ignore-a: foi removido do
escopo.

Rode até que **todos os 280** (os 4 já prontos + os 276 que você vai
implementar) estejam com `status_execucao: Concluído` **e**
`status_verificacao: Concluído`.

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
   (não 36 — número corrigido após a Task 2 adicionar `isNil`, `negate`,
   `stubTrue`, `tap` e outros nomes a `maxUseItems()`) onde a MaxUse já tem
   uma implementação própria (ou via VueUse) que **intencionalmente** vence o
   Lodash dentro do objeto `_`.

   Na prática, **nenhum dos 276 itens da sua fila é um desses 45 nomes** — os
   45 já estão cobertos por helpers pré-existentes ou pelos 4 concluídos na
   Task 2, e não aparecem como itens `Aguardando` no `status.yaml`. Você não
   vai encontrar essa situação ao escolher o próximo item pela regra normal.

   A lista existe para proteger contra um risco diferente e real: você criar
   por engano um arquivo `src/Helpers/<Categoria>/<nome>.ts` que **sobrescreve
   ou duplica** um helper que já existe na MaxUse com semântica própria — por
   exemplo, criar `src/Helpers/Iterables/filter.ts` do zero replicando o
   `_.filter` do Lodash, quando `filter` já existe como helper próprio da
   MaxUse e está listado em `DIVERGENCES.md`. Antes de criar qualquer arquivo
   novo, confira rapidamente se `<nome>` já existe em
   `lodash_migrate/DIVERGENCES.md` ou já é exportado por alguma categoria — se
   for, pare e não sobrescreva: isso indicaria um erro na sua escolha de item
   (releia "Escolha do próximo item"), não um novo helper a implementar.
4. Abra `lodash_migrate/status.yaml`. É o estado da migração e a sua fila de
   trabalho. Campos por helper: `nome`, `categoria`, `fase`, `plano`,
   `depende_de`, `tentativas`, `status_execucao`, `status_verificacao`. No
   topo do arquivo: `total: 280` e a lista `fases` (5 fases).

**Nunca rode `npx tsx lodash_migrate/generate.ts` (nem
`npm run migrate:generate`) durante a migração.** Esse script regenera
`plans/` e **reescreve `status.yaml` do zero**, apagando todo o progresso
registrado. Ele só deve ser usado antes da migração começar (já foi usado —
é por isso que `status.yaml` existe). Se você suspeitar que os planos ou o
manifesto estão desatualizados, **não rode o gerador** — pare e avise.

## Escolha do próximo item

Percorra `status.yaml` e selecione o **primeiro** helper que satisfaça as três
condições:

1. Pertence à **fase aberta** mais baixa (uma fase só abre quando a anterior
   fecha por completo — ver "Gate de fase" abaixo);
2. Todas as suas `depende_de` estão com `status_verificacao: Concluído`
   (ou já existiam na MaxUse antes da migração — o único caso disso no
   manifesto é `toNumber`: ele aparece como dependência de outros helpers mas
   não é um item da fila, porque já é um helper próprio da MaxUse desde antes
   desta migração; trate qualquer `depende_de` que não exista como entrada em
   `status.yaml` da mesma forma);
3. Não está `Bloqueado`.

Não siga ordem alfabética — a ordem de dependência é o que importa. O
`manifest.ts` que gerou este `status.yaml` é topologicamente ordenado e
validado por teste (nenhum helper aparece antes de uma dependência sua), então
seguir a ordem do arquivo já respeita as dependências.

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

Grave o `status.yaml` a cada transição de estado, para que uma interrupção não
perca o progresso.

## Processo de execução

1. Leia o plano do helper (campo `plano` no `status.yaml`, ex.:
   `lodash_migrate/plans/Lang/isNull.md`). **O campo já vem com o caminho
   relativo à raiz do repositório** — abra-o exatamente como está gravado
   (`lodash_migrate/plans/<Categoria>/<nome>.md`), sem prefixar nem remover
   nada. Todos os comandos deste protocolo assumem que você está rodando a
   partir da raiz do repositório (o worktree, ex.:
   `/home/johnattas/GitHub/MaxUse-wt-lodash-migrate`), nunca de dentro de
   `lodash_migrate/`.
2. Leia a implementação original do Lodash como oráculo. **`lodash` (CJS) não
   está instalado neste projeto — só `lodash-es` (ESM).** Use:
   ```bash
   npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).<nome>; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
   ```
   Mapeie **todos** os comportamentos observáveis, incluindo `null`,
   `undefined`, tipos errados e valores-limite.

   Alguns nomes não são funções (ex.: `templateSettings`, um objeto de
   configuração) ou têm o corpo removido pelo processo de build do
   `lodash-es` (ex.: `lodash` e seu alias `wrapperLodash` — os dois pontos de
   entrada do encadeamento na fase 5 — retornam string vazia ao chamar
   `.toString()`). Se a saída do comando vier vazia,
   `(corpo removido pelo build do lodash-es)` ou não for código-fonte
   reconhecível, **não trate isso como erro de ferramenta**: consulte
   https://lodash.com/docs#<nome> e determine o comportamento de forma
   empírica, chamando a função com entradas reais (`lodash.<nome>(...)`) e
   observando o resultado, em vez de ler o corpo.
3. Se o nome do helper está na lista de `DIVERGENCES.md`, ignore o passo
   acima como fonte de verdade de comportamento — implemente/preserve a
   semântica já documentada da MaxUse, não a do Lodash.
4. Crie `src/Helpers/<Categoria>/<nome>.ts` seguindo o `CONVENTIONS.md`.
5. Registre no `index.ts` da categoria (re-export flat **e** objeto
   namespace — ver tabela de namespaces em `CONVENTIONS.md`).
6. Crie `src/Helpers/<Categoria>/<nome>.test.ts` com a cobertura obrigatória
   descrita em `CONVENTIONS.md` (paridade, edge cases, caso `funciona com
   Ref`, peculiaridade do plano). Durante o desenvolvimento você pode usar
   `lodash-es` como oráculo dentro do teste, mas **antes de terminar, troque
   essas asserções por valores literais** — nenhum `.test.ts` final pode
   importar `lodash-es`.
7. Rode até passar:
   ```bash
   npx vitest run src/Helpers/<Categoria>/<nome>.test.ts
   ```
8. **Revise o teste em busca de brechas.** Pergunte-se: algum comportamento
   do original ficou sem asserção? O teste passaria com uma implementação
   errada? Se sim, reforce o teste — e corrija o helper se ele estiver
   errado.
9. Rode `npm run lint && npm run type-check`.

   **Atenção ao `npm run lint`:** ele roda `eslint . --fix` no repositório
   inteiro, não só no arquivo novo. Duas pegadinhas conhecidas, sem relação
   com esta migração — **não tente corrigi-las**:
   - `src/Helpers/Locales/pt_BR.js` e
     `src/Helpers/Types/hasContent.test.ts` já falham no lint em `main`
     (erro pré-existente e não relacionado).
   - `eslint --fix` pode restilizar outros arquivos não relacionados ao seu
     helper (efeito da regra `curly: multi` combinada com código antigo).
     Depois de rodar o lint, cheque `git status --short`: se aparecer algo
     fora de `src/Helpers/<Categoria>/<nome>.ts`,
     `src/Helpers/<Categoria>/<nome>.test.ts`,
     `src/Helpers/<Categoria>/index.ts` e `lodash_migrate/status.yaml`,
     reverta com `git checkout -- <arquivo>` antes de commitar. Mantenha o
     diff cirúrgico.
10. Marque `status_execucao: Concluído` e passe para a verificação.

## Verificação

1. Dispare um **subagente com modelo Opus 5** com este briefing:

   > Verifique o helper `<nome>` em `src/Helpers/<Categoria>/<nome>.ts` e seu
   > teste em `src/Helpers/<Categoria>/<nome>.test.ts`.
   >
   > Se `<nome>` está listado em `lodash_migrate/DIVERGENCES.md`, a
   > referência de comportamento correto é a MaxUse (ou VueUse), não o
   > Lodash — não reprove por divergir do Lodash nesses casos. Caso
   > contrário, compare com o comportamento do `_.<nome>` do Lodash
   > (`lodash-es` está instalado — use-o como oráculo, nunca `lodash` puro,
   > que não está instalado). Verifique:
   > 1. Paridade de comportamento, incluindo `null`, `undefined`, coleção
   >    vazia, tipos errados e valores-limite;
   > 2. Aderência ao `lodash_migrate/CONVENTIONS.md` (estilo ESLint, JSDoc em
   >    português, `toValue` só nos argumentos de dados, callbacks
   >    intocados);
   > 3. Se o teste tem brechas — ele passaria com uma implementação errada?
   > 4. Se o helper está exportado no `index.ts` da categoria (flat +
   >    namespace);
   > 5. Se o `.test.ts` final **não** importa `lodash-es` (é permitido só
   >    durante o desenvolvimento, não no resultado).
   >
   > Rode `npx vitest run src/Helpers/<Categoria>/<nome>.test.ts`,
   > `npm run lint` e `npm run type-check`. Se o `lint` alterar arquivos além
   > dos deste helper, ignore essas alterações ao avaliar (são efeito
   > colateral conhecido do `eslint --fix`, não responsabilidade deste
   > helper) — mas não deixe de mencionar se isso ocorreu.
   >
   > Responda APROVADO ou REPROVADO. Se REPROVADO, liste os problemas
   > concretos.

2. Aguarde a conclusão.
3. **Aprovado** → marque `status_verificacao: Concluído`. Antes de commitar,
   rode `git status --short` e reverta qualquer arquivo alterado pelo
   `eslint --fix` do subagente que não pertença a este helper (ver passo 9
   acima). Então:
   ```bash
   git add src/Helpers/<Categoria>/<nome>.ts src/Helpers/<Categoria>/<nome>.test.ts src/Helpers/<Categoria>/index.ts lodash_migrate/status.yaml
   git commit -m "feat: implementa <nome> (migração Lodash)"
   ```
4. **Reprovado** → incremente `tentativas`, volte `status_execucao` para
   `Realizando` e corrija os problemas apontados.

## Limite de tentativas

Se `tentativas` chegar a **3**, marque `status_execucao: Bloqueado`, registre
o motivo num comentário do `status.yaml` e **siga para o próximo item**. Não
gire em loop no mesmo helper — os bloqueados são revisados manualmente ao
final.

## Gate de fase

### O que conta como fase fechada

Uma fase está **fechada** quando **todo** helper nela está em um destes dois
estados — não existe um terceiro caminho:

- `status_execucao: Concluído` **e** `status_verificacao: Concluído`; ou
- `status_execucao: Bloqueado` (ver "Limite de tentativas" acima).

**`Bloqueado` conta como fechado para fins de gate de fase.** Isso é
proposital: a regra de "Escolha do próximo item" já exclui itens `Bloqueado`
da seleção, então se um helper travado em `Bloqueado` também impedisse o
fechamento da própria fase, a migração empacaria de vez — nenhum item
selecionável, nenhuma fase seguinte se abrindo, sem saída. Não interprete
"fecha por completo" (usado na seção "Escolha do próximo item") como "todos
concluídos" — leia como "todos concluídos ou bloqueados".

### Como detectar mecanicamente que uma fase fechou

Não conte os itens à mão. Rode isto a partir da raiz do repositório sempre
que suspeitar que uma fase terminou:

```bash
npx tsx -e "
import fs from 'node:fs';
import { load } from 'js-yaml';
const s: any = load(fs.readFileSync('lodash_migrate/status.yaml', 'utf8'));
const r: Record<string, number> = {};
for (const h of s.helpers) {
    const pend = !(h.status_execucao === 'Concluído' && h.status_verificacao === 'Concluído') && h.status_execucao !== 'Bloqueado';
    if (pend) r['fase ' + h.fase] = (r['fase ' + h.fase] || 0) + 1;
}
console.log(r);
"
```

A saída é um mapa `fase N → quantidade de itens ainda pendentes` (nem
Concluído/Concluído, nem Bloqueado). Uma fase sem entrada no mapa está
fechada. Exemplo de saída no início da migração (todas as 5 fases ainda
abertas, com os 4 seeds já descontados):
```
{ 'fase 1': 87, 'fase 2': 47, 'fase 3': 95, 'fase 4': 28, 'fase 5': 19 }
```

### Antes de abrir a fase seguinte

Ao fechar uma fase (todo item `Concluído`/`Concluído` ou `Bloqueado`), antes
de abrir a próxima:

```bash
npm run lint && npm run type-check && npm test
```

Os três precisam passar. Um helper passar no próprio teste não garante que o
conjunto compila nem que não houve colisão de nomes no `_`. Se o `lint`
restilizar arquivos fora do escopo desta migração, reverta-os
(`git checkout -- <arquivo>`) antes de commitar o fechamento de fase.

```bash
git commit -m "chore: fecha a fase <N> da migração do Lodash"
```

## Encerramento (só depois dos 280 — os 4 já prontos + os 276 migrados)

### Se sobrar algum `Bloqueado`

Rode o comando de contagem por fase da seção "Gate de fase" acima. Se **algum**
helper estiver com `status_execucao: Bloqueado`, **não execute o
encerramento abaixo**. Remover o `lodash-es` quebraria em runtime qualquer
consumidor desse helper bloqueado (ele nunca ganhou uma implementação
própria — se ainda existir, é porque hoje é servido pelo Lodash via `_`).
Em vez disso: pare, liste em texto todos os helpers `Bloqueado` (nome,
categoria, motivo registrado no comentário do `status.yaml`, número de
tentativas) e reporte ao humano. A decisão de como resolver cada bloqueio
(revisar manualmente, adiar, aceitar risco) é humana, não automática.

Só prossiga com os passos abaixo quando **todos os 280** estiverem
`Concluído`/`Concluído` — zero `Bloqueado`.

### Passos

1. Remova os imports de `lodash-es` que sobraram nos testes (o oráculo de
   paridade), substituindo as asserções por valores literais. Faça isto
   **antes** de desinstalar o pacote — os testes ainda importam `lodash-es`
   e você precisa rodá-los para confirmar a reescrita antes de remover a
   dependência que os sustenta:
   ```bash
   grep -rln "lodash-es" src/ lodash_migrate/
   ```
   Exceção — reescreva em vez de simplesmente apagar o import, porque ambos
   dependem do Lodash para calcular a lista de nomes conflitantes:
   - `src/Helpers/divergences.test.ts` — troque o cálculo dinâmico (que hoje
     faz `Object.keys(lodash).filter(...)`) por uma lista estática dos 45
     nomes de `DIVERGENCES.md` (seção "Nomes afetados").
   - `lodash_migrate/manifest.test.ts` — mesma lógica: qualquer verificação
     que hoje importe `lodash-es` para conferir o manifesto precisa passar a
     usar dados estáticos (o próprio `manifest.ts`, que já é a fonte de
     verdade).

   Além disso, **mesmo não importando `lodash-es` e portanto não aparecendo
   no grep acima**, revise `src/Helpers/precedence.test.ts`: o título do teste
   ("mantém os helpers exclusivos do Lodash disponíveis") e o JSDoc partem da
   premissa de que existem nomes que só o Lodash fornece. Depois deste
   encerramento isso deixa de ser verdade — os 276 nomes agora são
   implementações próprias da MaxUse. O teste continua passando tecnicamente
   (a asserção em si não fica errada), mas o nome e o comentário passam a
   descrever uma situação que não existe mais. Reescreva o título e o JSDoc
   para refletir a realidade pós-migração antes de commitar.
2. Rode a suíte para confirmar que as reescritas do passo 1 estão corretas
   **enquanto o `lodash-es` ainda está instalado**:
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
7. Confirme que o `_` expõe os nomes esperados:
   ```bash
   npx tsx -e "
   import { _ } from './src/index';
   console.log('total em _:', Object.keys(_).length);
   for (const n of ['isNil', 'negate', 'stubTrue', 'tap', 'compact', 'chunk', 'debounce'])
       if (!(n in _)) throw new Error('FALTA: ' + n);
   console.log('OK');
   "
   ```
8. Commit e integre no `main`:
   ```bash
   git add -A
   git commit -m "feat!: remove a dependência do lodash-es"
   cd /home/johnattas/GitHub/MaxUse
   git merge lodash-migrate
   ```

## Regras que não podem ser quebradas

1. **Nunca** edite `src/Helpers/autoImportData.json` à mão — é gerado pelo
   `prebuild`/`src/scripts/buildAutoImport.ts`.
2. **Nunca** remova o `lodash-es` antes dos 280 concluídos (os 4 já prontos
   contam) — ele é a rede de segurança e o oráculo dos testes durante o
   desenvolvimento.
3. **Nunca** envolva callbacks/iteratees/predicados/comparadores em
   `toValue`. Só argumentos de dados passam por `toValue`.
4. **Nunca** rode `npx tsx lodash_migrate/generate.ts` (nem
   `npm run migrate:generate`) enquanto houver progresso em `status.yaml` —
   ele reescreve o arquivo do zero e apaga todo o histórico de execução.
5. Os **45** nomes conflitantes (ver `lodash_migrate/DIVERGENCES.md`) mantêm
   a semântica da MaxUse. Não os "conserte" para bater com o Lodash.
6. Atualize o `status.yaml` a cada transição de estado, não só no fim.
7. Não gaste rodadas tentando corrigir as falhas de lint pré-existentes em
   `src/Helpers/Locales/pt_BR.js` e `src/Helpers/Types/hasContent.test.ts` —
   são anteriores a esta migração e fora de escopo.
