# throttle

**Categoria:** Functions
**Fase:** 4
**Destino:** `src/Helpers/Functions/throttle.ts`
**Teste:** `src/Helpers/Functions/throttle.test.ts`
**Registro:** `src/Helpers/Functions/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
node -e "const _=require('lodash'); console.log(_.throttle.toString())"
```

A documentação oficial está em https://lodash.com/docs#throttle

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

## Peculiaridade do Lodash

implementado sobre debounce com maxWait

Esta peculiaridade **precisa** de um caso de teste dedicado.

## Dependências

- `debounce`

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Functions/throttle.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Functions/index.ts` (re-export flat **e** entrada no objeto namespace).
4. Criar `src/Helpers/Functions/throttle.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Functions/throttle.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Functions/throttle.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Functions/index.ts` (flat + namespace).
- [ ] `npm run lint` e `npm run type-check` passam.
- [ ] Há teste dedicado para: implementado sobre debounce com maxWait
