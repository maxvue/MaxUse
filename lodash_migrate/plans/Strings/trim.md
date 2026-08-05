# trim

**Categoria:** Strings
**Fase:** 1
**Destino:** `src/Helpers/Strings/trim.ts`
**Teste:** `src/Helpers/Strings/trim.test.ts`
**Registro:** `src/Helpers/Strings/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).trim; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
```

A documentação oficial está em https://lodash.com/docs#trim

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

Alguns nomes não são funções (ex.: `templateSettings`, um objeto) ou têm o
corpo removido pelo processo de build do `lodash-es` (ex.: `lodash` e seu
alias `wrapperLodash`, o ponto de entrada do encadeamento — ambos retornam
string vazia ao chamar `.toString()`). Se a saída do comando acima vier
vazia, `(corpo removido pelo build do lodash-es)` ou não for código-fonte,
consulte https://lodash.com/docs#trim e determine o comportamento de
forma empírica, chamando a função com entradas reais e observando o
resultado.

## Peculiaridade do Lodash

aceita chars customizados

Esta peculiaridade **precisa** de um caso de teste dedicado.

## Dependências

- Nenhuma.

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Strings/trim.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Strings/index.ts` (re-export flat — esta categoria não tem objeto namespace, não crie um).
4. Criar `src/Helpers/Strings/trim.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Strings/trim.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Strings/trim.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Strings/index.ts` (export plano — esta categoria **não tem** objeto namespace; export plano sozinho já satisfaz o registro, não crie um namespace novo).
- [ ] `npm run lint` e `npm run type-check` passam.
- [ ] Há teste dedicado para: aceita chars customizados
