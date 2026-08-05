# divide

**Categoria:** Math
**Fase:** 1
**Destino:** `src/Helpers/Math/divide.ts`
**Teste:** `src/Helpers/Math/divide.test.ts`
**Registro:** `src/Helpers/Math/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
node -e "const _=require('lodash'); console.log(_.divide.toString())"
```

A documentação oficial está em https://lodash.com/docs#divide

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

## Peculiaridade do Lodash

divide() sem args retorna 1

Esta peculiaridade **precisa** de um caso de teste dedicado.

## Dependências

- Nenhuma.

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Math/divide.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Math/index.ts` (re-export flat **e** entrada no objeto namespace).
4. Criar `src/Helpers/Math/divide.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Math/divide.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Math/divide.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Math/index.ts` (flat + namespace).
- [ ] `npm run lint` e `npm run type-check` passam.
- [ ] Há teste dedicado para: divide() sem args retorna 1
