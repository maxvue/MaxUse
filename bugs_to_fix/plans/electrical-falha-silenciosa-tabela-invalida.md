# Tabela ausente ou corrompida degrada silenciosamente para resultado não validado

- **Severidade:** média
- **Arquivo:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) — linhas 151-153
- **Categoria:** tratamento de erro em código de segurança

## Problema

O `catch` genérico registra um aviso no console e devolve um resultado
calculado só por fórmula — **indistinguível de um resultado validado por
tabela**.

## Evidência

```
Erro ao carregar dados da tabela de cabos TypeError: dados.find is not a function
{"wire":1.5,"max_current":20,...}      <-- 1,5 mm² para 20 A: abaixo da ampacidade NBR
```

Mesmo comportamento com `method` inexistente (`method:'zzz'`): 1,5 mm² para
20 A, apenas com aviso no console.

Em código de dimensionamento elétrico, tabela ausente precisa falhar **alto**.
Um `console.warn` em produção é invisível.

## Achado adicional

`src/json/cu-70-bi-falsy.json` (conteúdo: `false`) e
`cu-70-bi-mocktest.json` são **fixtures de teste publicados em `src/json/`** e
alcançáveis pelo parâmetro público `method`. Devem sair do diretório de dados
de produção.

## Correção proposta

Validar que o módulo carregado é array não-vazio; sinalizar explicitamente —
`table_loaded: boolean` no retorno, ou lançar — para que o chamador consiga
distinguir resultado validado de estimativa.

## Teste de regressão

```ts
it('sinaliza quando a tabela não pôde ser carregada', async () => {
    const r = await wireSize(20, { ...base, method: 'zzz' as never });
    expect(r === null || r.table_loaded === false).toBe(true);
});
```
