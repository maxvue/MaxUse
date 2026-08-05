# unescape

**Categoria:** Strings
**Fase:** 1
**Destino:** `src/Helpers/Strings/unescape.ts`
**Teste:** `src/Helpers/Strings/unescape.test.ts`
**Registro:** `src/Helpers/Strings/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
node -e "const _=require('lodash'); console.log(_.unescape.toString())"
```

A documentação oficial está em https://lodash.com/docs#unescape

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

## Peculiaridade do Lodash

inverso de escape

Esta peculiaridade **precisa** de um caso de teste dedicado.

## Dependências

- Nenhuma.

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Strings/unescape.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Strings/index.ts` (re-export flat **e** entrada no objeto namespace).
4. Criar `src/Helpers/Strings/unescape.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Strings/unescape.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Strings/unescape.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Strings/index.ts` (flat + namespace).
- [ ] `npm run lint` e `npm run type-check` passam.
- [ ] Há teste dedicado para: inverso de escape
