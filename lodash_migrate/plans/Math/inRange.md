# inRange

**Categoria:** Math
**Fase:** 1
**Destino:** `src/Helpers/Math/inRange.ts`
**Teste:** `src/Helpers/Math/inRange.test.ts`
**Registro:** `src/Helpers/Math/index.ts`

> Leia `lodash_migrate/CONVENTIONS.md` antes de implementar. O contrato de estilo,
> reatividade e teste vale para todos os helpers e não é repetido aqui.

## Referência original

Consulte a implementação e a documentação do Lodash antes de escrever:

```bash
node -e "const _=require('lodash'); console.log(_.inRange.toString())"
```

A documentação oficial está em https://lodash.com/docs#inRange

O `lodash-es` ainda está instalado, então use-o como oráculo de paridade
nos casos-limite durante o desenvolvimento.

## Peculiaridade do Lodash

2 args => range [0, n); swap se start > end

Esta peculiaridade **precisa** de um caso de teste dedicado.

## Dependências

- Nenhuma.

Todas devem estar com `status_verificacao: Concluído` antes de iniciar este helper.

## Passos

1. Ler a implementação original e mapear **todos** os comportamentos observáveis,
   incluindo o tratamento de `null`, `undefined`, tipos errados e valores-limite.
2. Criar `src/Helpers/Math/inRange.ts` seguindo o contrato do `CONVENTIONS.md`.
3. Registrar o export em `src/Helpers/Math/index.ts` (re-export flat **e** entrada no objeto namespace).
4. Criar `src/Helpers/Math/inRange.test.ts` com a cobertura obrigatória descrita no `CONVENTIONS.md`.
5. Rodar `npx vitest run src/Helpers/Math/inRange.test.ts` até passar.
6. Revisar o teste em busca de brechas: algum comportamento do original ficou sem asserção?
7. Rodar `npm run lint && npm run type-check`.

## Critérios de aprovação

- [ ] `npx vitest run src/Helpers/Math/inRange.test.ts` passa.
- [ ] Paridade com o Lodash confirmada nos casos-limite (comparada contra `lodash-es`).
- [ ] Argumentos de dados aceitam `MaybeRefOrGetter` e usam `toValue`; callbacks **não**.
- [ ] Existe um caso de teste `funciona com Ref`.
- [ ] Exportado em `src/Helpers/Math/index.ts` (flat + namespace).
- [ ] `npm run lint` e `npm run type-check` passam.
- [ ] Há teste dedicado para: 2 args => range [0, n); swap se start > end
