import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dump } from 'js-yaml';
import { HELPERS, type HelperEntry } from './manifest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOTAL_ESPERADO = 280;

/**
 * Helpers já implementados como sementes de categoria na Task 2. Permanecem
 * no manifesto (fazem parte dos 280), mas o status.yaml gerado deve refletir
 * que já estão concluídos — não devem ser reprocessados pela fila de execução.
 * Ruling do parceiro humano; não reabrir sem nova decisão explícita.
 */
const JA_IMPLEMENTADOS = new Set(['isNil', 'negate', 'stubTrue', 'tap']);

/**
 * Categorias que têm objeto namespace de verdade (`lang`, `functionsHelpers`,
 * `utils`, `seq`). Nestas, o registro exige export plano **e** entrada no
 * namespace. Nas demais (`Iterables`, `Math`, `Objects`, `Strings`) não existe
 * namespace exaustivo — o export plano sozinho satisfaz o registro; ver
 * CONVENTIONS.md ("Registro no barrel") para o porquê (namespaces são
 * cosméticos, `_` e o auto-import vêm dos exports planos).
 */
const CATEGORIAS_COM_NAMESPACE = new Set(['Lang', 'Functions', 'Utils', 'Seq']);

const FASES = [
    { id: 1, nome: 'Primitivos sem dependência', detalhe: 'Lang, Math, Strings simples e Utils básicos.' },
    { id: 2, nome: 'Arrays e coleções', detalhe: 'Iterables sem iteratee e acesso básico a objetos.' },
    { id: 3, nome: 'Derivados de iteratee', detalhe: 'Coleções, objetos e strings que dependem do shorthand.' },
    { id: 4, nome: 'Functions e Utils', detalhe: 'Programação funcional e template.' },
    { id: 5, nome: 'Seq (chaining)', detalhe: 'Wrapper de encadeamento; depende do fechamento da fase 4.' }
];

/** Monta o conteúdo Markdown do plano de um helper. */
const planoDe = (h: HelperEntry): string => {
    const destino = `src/Helpers/${h.categoria}/${h.nome}.ts`;
    const teste = `src/Helpers/${h.categoria}/${h.nome}.test.ts`;
    const barrel = `src/Helpers/${h.categoria}/index.ts`;

    const deps = h.depende_de.length > 0
        ? h.depende_de.map((d) => `- \`${d}\``).join('\n')
        : '- Nenhuma.';

    const alias = h.alias_de
        ? `\n## Alias\n\nEste helper é um alias de \`${h.alias_de}\`. A implementação deve re-exportar o original, não duplicar a lógica:\n\n\`\`\`typescript\nexport { ${h.alias_de} as ${h.nome} } from './${h.alias_de}';\n\`\`\`\n\nSe o original estiver em outra categoria, ajuste o caminho relativo.\n`
        : '';

    const nota = h.nota
        ? `\n## Peculiaridade do Lodash\n\n${h.nota}\n\nEsta peculiaridade **precisa** de um caso de teste dedicado.\n`
        : '';

    const jaImplementado = JA_IMPLEMENTADOS.has(h.nome)
        ? '\n> **Já implementado.** Este helper foi construído na Task 2 como semente de categoria e está\n> marcado `Concluído`/`Concluído` no `status.yaml`. Este plano é mantido apenas como referência;\n> não há trabalho pendente aqui a menos que uma revisão de verificação aponte o contrário.\n'
        : '';

    return `# ${h.nome}

**Categoria:** ${h.categoria}
**Fase:** ${h.fase}
**Destino:** \`${destino}\`
**Teste:** \`${teste}\`
**Registro:** \`${barrel}\`
${jaImplementado}
> Leia \`lodash_migrate/CONVENTIONS.md\` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

\`\`\`bash
npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).${h.nome}; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
\`\`\`

A documentação oficial está em https://lodash.com/docs#${h.nome}

O \`lodash-es\` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

Alguns nomes não são funções (ex.: \`templateSettings\`, um objeto) ou têm o
corpo removido pelo processo de build do \`lodash-es\` (ex.: \`lodash\` e seu
alias \`wrapperLodash\`, o ponto de entrada do encadeamento — ambos retornam
string vazia ao chamar \`.toString()\`). Se a saída do comando acima vier
vazia, \`(corpo removido pelo build do lodash-es)\` ou não for código-fonte,
consulte https://lodash.com/docs#${h.nome} e determine o comportamento de
forma empírica, chamando a função com entradas reais e observando o
resultado.
${alias}${nota}
## Dependências

${deps}

Todas devem estar com \`status_verificacao: Concluído\` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de \`null\`, \`undefined\`, tipos errados e valores-limite.
2. Criar \`${destino}\` seguindo o contrato do \`CONVENTIONS.md\`.
3. Registrar o export em \`${barrel}\` (${CATEGORIAS_COM_NAMESPACE.has(h.categoria)
    ? 're-export flat **e** entrada no objeto namespace'
    : 're-export flat — esta categoria não tem objeto namespace, não crie um'}).
4. Criar \`${teste}\` com a cobertura obrigatória descrita no \`CONVENTIONS.md\`.
5. Rodar \`npx vitest run ${teste}\` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar \`npm run lint && npm run type-check\`.

## Critérios de aprovação

- [ ] \`npx vitest run ${teste}\` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra \`lodash-es\`).
- [ ] Argumentos de dados aceitam \`MaybeRefOrGetter\` e usam \`toValue\`; callbacks **não**.
- [ ] Existe um caso de teste \`funciona com Ref\`.
- [ ] Exportado em \`${barrel}\` (${CATEGORIAS_COM_NAMESPACE.has(h.categoria)
    ? 'export plano **e** entrada no objeto namespace — ambos obrigatórios nesta categoria'
    : 'export plano — esta categoria **não tem** objeto namespace; export plano sozinho já satisfaz o registro, não crie um namespace novo'}).
- [ ] \`npm run lint\` e \`npm run type-check\` passam.
${h.nota ? `- [ ] Há teste dedicado para: ${h.nota}\n` : ''}`;
};

export const gerar = (): void => {
    if (HELPERS.length !== TOTAL_ESPERADO) throw new Error(`Manifesto com ${HELPERS.length} helpers; esperado ${TOTAL_ESPERADO}.`);

    const raizPlanos = path.resolve(__dirname, 'plans');
    fs.rmSync(raizPlanos, { recursive: true, force: true });

    for (const h of HELPERS) {
        const pasta = path.resolve(raizPlanos, h.categoria);
        fs.mkdirSync(pasta, { recursive: true });
        fs.writeFileSync(path.resolve(pasta, `${h.nome}.md`), planoDe(h));
    }

    const status = {
        total: HELPERS.length,
        fases: FASES,
        helpers: HELPERS.map((h) => {
            const concluido = JA_IMPLEMENTADOS.has(h.nome);
            return {
                nome: h.nome,
                categoria: h.categoria,
                fase: h.fase,
                plano: `lodash_migrate/plans/${h.categoria}/${h.nome}.md`,
                depende_de: h.depende_de,
                tentativas: 0,
                status_execucao: concluido ? 'Concluído' : 'Aguardando',
                status_verificacao: concluido ? 'Concluído' : 'Aguardando'
            };
        })
    };

    fs.writeFileSync(
        path.resolve(__dirname, 'status.yaml'),
        dump(status, { lineWidth: 120, noRefs: true })
    );

    console.log(`Gerados ${HELPERS.length} planos em lodash_migrate/plans e o status.yaml`);
};

if (import.meta.url === `file://${process.argv[1]}`) gerar();
