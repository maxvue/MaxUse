# Tabelas NBR 5410 desordenadas quebram a busca de ampacidade

- **Severidade:** CRÍTICA — maior achado desta auditoria
- **Arquivos:** [src/Helpers/Electrical/wireSize.ts](../../src/Helpers/Electrical/wireSize.ts) linha 135 + 16 arquivos em [src/json/](../../src/json/)
- **Categoria:** bug de correção em código de segurança (dimensionamento elétrico)

## Problema

A busca de ampacidade usa `dados.find(c => c.max_current >= correctedCurrent)`,
o que **pressupõe que a tabela esteja em ordem crescente de `max_current`**.
Essa precondição não está documentada nem é verificada — e **16 das 70 tabelas
não a satisfazem**.

Numa tabela desordenada, o `find` retorna a primeira linha que satisfaz o
critério na ordem em que os dados estão gravados, e não a menor bitola
adequada. Como `cu-70-bi-b1.json` começa em `{max_current: 415, wire: 240}`,
essa primeira linha atende quase qualquer corrente.

## Evidência

Tabelas fora de ordem crescente (16 de 70):

```
$ npx tsx -e "<varre src/json e compara max_current com sua versão ordenada>"

TOTAL JSON: 70
UNSORTED COUNT: 16
al-70-bi-b2   al-70-tri-b2  al-70-tri-g   al-90-bi-c
al-90-bi-e    al-90-bi-f    al-90-tri-e   al-90-tri-f
al-90-tri-g   cu-70-bi-b1   cu-70-tri-b1  cu-70-tri-f
cu-70-tri-g   cu-90-bi-b2   cu-90-tri-b2  cu-90-tri-g
```

Consequência prática, comparando um método com tabela desordenada (`b1`) e
outro com tabela ordenada (`c`), mesma corrente:

```
$ npx tsx -e "import {wireSize} from './src/Helpers/Electrical/wireSize';
(async()=>{ ... })();"

20A  method=b1 -> wire=240  max_current=415     # esperado: wire 2.5
20A  method=c  -> wire=2.5  max_current=27      # correto
100A method=b1 -> wire=240  max_current=415     # esperado: wire 25
```

Varredura de todas as tabelas × {16, 25, 40, 63} A: **61 divergências em 272
verificações**.

## Impacto

O método **B1 é o padrão residencial brasileiro** (eletroduto embutido em
alvenaria). Um circuito de tomadas de 20 A é dimensionado como **240 mm² em vez
de 2,5 mm²** — erro de custo de material da ordem de 100×.

A direção predominante do erro é **superdimensionamento**, que é caro mas não
inseguro. Porém a desordem não é uniforme: `cu-70-tri-b1.json` tem
`{max_current: 906, wire: 1000}` no índice 10 e um `{max_current: 186,
wire: 120}` ao final. Ordenações assim podem selecionar uma linha
**subdimensionada** para correntes altas — e aí o erro passa a ser **risco de
incêndio**.

## Causa raiz

A geração das tabelas nunca ordenou a saída. O algoritmo depende de ordenação
crescente, mas essa precondição é implícita: não há comentário, asserção nem
teste que a proteja.

## Correção proposta

Ordenar no carregamento — corrige as 16 tabelas de uma vez e **continua válido
se alguém editar/regenerar os JSON no futuro**:

```ts
const dados = [...raw].sort((a, b) => a.max_current - b.max_current);
```

Complementarmente:

1. Reordenar fisicamente os 16 arquivos JSON (higiene do dado).
2. Adicionar asserção em tempo de build/teste de que toda tabela está ordenada.

Ordenar no carregamento é a correção robusta; reordenar os arquivos sozinho
apenas mascara a fragilidade até a próxima regeneração.

> **Atenção:** esta correção **quebra intencionalmente** o teste descrito em
> [electrical-testes-codificam-o-bug](./electrical-testes-codificam-o-bug.md),
> que hoje afirma o valor corrompido. Os dois planos precisam ser executados
> juntos, na mesma tarefa.

## Teste de regressão

```ts
it('todas as tabelas NBR estão em ordem crescente de max_current', () => {
    for (const file of tableFiles) {
        const rows = load(file);
        const currents = rows.map(r => r.max_current);
        expect(currents).toEqual([...currents].sort((a, b) => a - b));
    }
});

it('dimensiona corretamente um circuito residencial B1 de 20A', async () => {
    const r = await wireSize(20, {
        material: 'copper', isolation: '70', method: 'b1',
        phases: 2, voltage: 220, length: 10
    });
    expect(r!.wire).toBe(2.5);
});
```
