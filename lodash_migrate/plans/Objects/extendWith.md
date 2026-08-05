# extendWith

**Categoria:** Objects
**Fase:** 3
**Destino:** `src/Helpers/Objects/extendWith.ts`
**Teste:** `src/Helpers/Objects/extendWith.test.ts`
**Registro:** `src/Helpers/Objects/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
npx tsx -e "import * as lodash from 'lodash-es'; import { inspect } from 'node:util'; const v = (lodash as any).extendWith; console.log(typeof v === 'function' ? (v.toString() || '(corpo removido pelo build do lodash-es)') : inspect(v, { depth: 1 }));"
```

A documentação oficial está em https://lodash.com/docs#extendWith

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

Alguns nomes não são funções (ex.: `templateSettings`, um objeto) ou têm o
corpo removido pelo processo de build do `lodash-es` (ex.: `lodash` e seu
alias `wrapperLodash`, o ponto de entrada do encadeamento — ambos retornam
string vazia ao chamar `.toString()`). Se a saída do comando acima vier
vazia, `(corpo removido pelo build do lodash-es)` ou não for código-fonte,
consulte https://lodash.com/docs#extendWith e determine o comportamento de
forma empírica, chamando a função com entradas reais e observando o
resultado.

## Alias

Este helper é um alias de `assignInWith`. A implementação deve re-exportar o original, não duplicar a lógica:

```typescript
export { assignInWith as extendWith } from './assignInWith';
```

Se o original estiver em outra categoria, ajuste o caminho relativo.

## Dependências

- `assignInWith`

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Objects/extendWith.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Objects/index.ts` (re-export flat **e** entrada no objeto namespace).
4. Criar `src/Helpers/Objects/extendWith.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Objects/extendWith.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Objects/extendWith.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Objects/index.ts` (flat + namespace).
- [ ] `npm run lint` e `npm run type-check` passam.
