/**
 * Suite de invariantes estruturais das tabelas de ampacidade em `src/json/`.
 *
 * ATENCAO — LIMITE DE ESCOPO, LEIA ANTES DE CONFIAR NO VERDE DESTA SUITE:
 *
 * Estes testes verificam **coerencia** das tabelas (entre si e consigo mesmas),
 * NAO **conformidade com a NBR 5410**. Nenhum valor de ampacidade aqui foi
 * conferido contra o texto da norma — a conferencia linha a linha das 68 tabelas
 * continua PENDENTE e e trabalho humano, com o documento em maos.
 *
 * O que esta suite pega: entrada duplicada, linha contaminada por copia de outra
 * tabela, bitola faltando, registro malformado, e inversoes entre tabelas vizinhas.
 * O que ela NAO pega: um erro de transcricao que preserve todas as relacoes acima
 * (por exemplo, uma coluna inteira deslocada de forma consistente).
 *
 * Ou seja: suite verde significa "as tabelas nao se contradizem", e nunca
 * "as tabelas estao conforme a norma".
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

type Registro = { max_current: number; wire: number };

const DIR_JSON = path.resolve(__dirname, '../../json');

/** Espelha a lista de secoes nominais usada por `wireSize.ts`. */
const ALL_WIRES = [0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000];

const MATERIAIS = ['cu', 'al'];
const ISOLACOES = ['70', '90'];
const FASES = ['bi', 'tri'];
const METODOS = ['a1', 'a2', 'b1', 'b2', 'c', 'd', 'e', 'f', 'g'];

/**
 * Metodos com duas configuracoes de agrupamento por bitola na NBR 5410 —
 * nestes arquivos a repeticao de `wire` e legitima e a tabela contem duas
 * series sobrepostas (piso e teto), interpoladas por `max_current`.
 * Existem apenas em trifasico.
 */
const METODOS_AGRUPADOS = ['f', 'g'];

/** `g` so existe em trifasico; as demais combinacoes existem para bi e tri. */
function tabelasEsperadas(): string[] {
    const nomes: string[] = [];
    for (const material of MATERIAIS) for (const isolacao of ISOLACOES) for (const fases of FASES) for (const metodo of METODOS) {
        if (metodo === 'g' && fases !== 'tri') continue;
        nomes.push(`${material}-${isolacao}-${fases}-${metodo}`);
    }
    return nomes.sort();
}

function lerTabela(nome: string): Registro[] {
    return JSON.parse(fs.readFileSync(path.join(DIR_JSON, `${nome}.json`), 'utf-8'));
}

const NOMES = tabelasEsperadas();
const TABELAS = new Map<string, Registro[]>(NOMES.map((nome) => [nome, lerTabela(nome)]));

function metodoDe(nome: string): string {
    return nome.split('-')[3];
}

function ehAgrupado(nome: string): boolean {
    return METODOS_AGRUPADOS.includes(metodoDe(nome));
}

/** Menor ampacidade registrada para cada bitola (serie "piso"). */
function ampacidadePiso(nome: string): Map<number, number> {
    const mapa = new Map<number, number>();
    for (const registro of TABELAS.get(nome)!) if (!mapa.has(registro.wire) || registro.max_current < mapa.get(registro.wire)!) mapa.set(registro.wire, registro.max_current);
    return mapa;
}

/** Maior ampacidade registrada para cada bitola (serie "teto"). */
function ampacidadeTeto(nome: string): Map<number, number> {
    const mapa = new Map<number, number>();
    for (const registro of TABELAS.get(nome)!) if (!mapa.has(registro.wire) || registro.max_current > mapa.get(registro.wire)!) mapa.set(registro.wire, registro.max_current);
    return mapa;
}

/**
 * Numero de linhas de cada tabela, fixado deliberadamente.
 *
 * Nao e um detalhe cosmetico: qualquer edicao futura que acrescente ou remova
 * uma linha de tabela normativa passa obrigatoriamente por este teste, e a
 * revisao do valor novo deixa de ser opcional.
 */
const LINHAS_ESPERADAS: Record<string, number> = {
    'al-70-bi-a1': 16, 'al-70-bi-a2': 16, 'al-70-bi-b1': 16, 'al-70-bi-b2': 16,
    'al-70-bi-c': 16, 'al-70-bi-d': 16, 'al-70-bi-e': 16, 'al-70-bi-f': 16,
    'al-70-tri-a1': 16, 'al-70-tri-a2': 16, 'al-70-tri-b1': 16, 'al-70-tri-b2': 16,
    'al-70-tri-c': 16, 'al-70-tri-d': 16, 'al-70-tri-e': 16, 'al-70-tri-f': 32, 'al-70-tri-g': 32,
    'al-90-bi-a1': 16, 'al-90-bi-a2': 16, 'al-90-bi-b1': 16, 'al-90-bi-b2': 16,
    'al-90-bi-c': 16, 'al-90-bi-d': 16, 'al-90-bi-e': 16, 'al-90-bi-f': 16,
    'al-90-tri-a1': 16, 'al-90-tri-a2': 16, 'al-90-tri-b1': 16, 'al-90-tri-b2': 16,
    'al-90-tri-c': 16, 'al-90-tri-d': 16, 'al-90-tri-e': 16, 'al-90-tri-f': 32, 'al-90-tri-g': 32,
    'cu-70-bi-a1': 24, 'cu-70-bi-a2': 24, 'cu-70-bi-b1': 24, 'cu-70-bi-b2': 24,
    'cu-70-bi-c': 24, 'cu-70-bi-d': 24, 'cu-70-bi-e': 24, 'cu-70-bi-f': 24,
    'cu-70-tri-a1': 24, 'cu-70-tri-a2': 24, 'cu-70-tri-b1': 24, 'cu-70-tri-b2': 24,
    'cu-70-tri-c': 24, 'cu-70-tri-d': 24, 'cu-70-tri-e': 24, 'cu-70-tri-f': 47, 'cu-70-tri-g': 47,
    'cu-90-bi-a1': 24, 'cu-90-bi-a2': 24, 'cu-90-bi-b1': 24, 'cu-90-bi-b2': 24,
    'cu-90-bi-c': 24, 'cu-90-bi-d': 24, 'cu-90-bi-e': 24, 'cu-90-bi-f': 24,
    'cu-90-tri-a1': 24, 'cu-90-tri-a2': 24, 'cu-90-tri-b1': 24, 'cu-90-tri-b2': 24,
    'cu-90-tri-c': 24, 'cu-90-tri-d': 24, 'cu-90-tri-e': 24, 'cu-90-tri-f': 47, 'cu-90-tri-g': 47
};

/**
 * Cadeia esperada de ampacidade por metodo de instalacao, do mais restritivo ao
 * mais favoravel a dissipacao de calor. `d` (enterrado) nao entra na cadeia
 * porque depende da resistividade termica do solo; `f`/`g` (agrupamento) tambem
 * nao, por terem duas series por bitola.
 */
const CADEIA_METODOS = ['a2', 'a1', 'b2', 'b1', 'c', 'e'];

/**
 * Inversoes REAIS e NAO RESOLVIDAS na cadeia de metodos, catalogadas uma a uma.
 *
 * Estas nao sao excecoes normativas conhecidas: sao suspeitas de erro de dado
 * que NAO foi possivel corrigir por falta do texto da NBR 5410. Nas tabelas de
 * aluminio a 90 °C o metodo `c` aparece com ampacidade MENOR que o `b1`, o que
 * contraria a fisica de dissipacao — e o desvio e sistematico, atingindo quase
 * toda a tabela. Nao da para saber, sem a norma, se o erro esta em `*-c`, em
 * `*-b1`, ou se ha particularidade normativa que o justifique. As tabelas de
 * cobre nao apresentam a inversao em nenhuma temperatura.
 *
 * O catalogo NAO afrouxa a regra: o teste abaixo exige que cada bitola listada
 * aqui continue de fato invertida. Se alguem corrigir o dado com a norma em
 * maos, o teste falha pedindo a remocao da entrada — o catalogo nao apodrece.
 *
 * PENDENTE: conferir `al-90-*-b1` e `al-90-*-c` contra a NBR 5410 e resolver.
 */
const INVERSOES_NAO_RESOLVIDAS: Record<string, number[]> = {
    'al-90-bi:b1<=c': [25, 35, 50, 70, 95, 120],
    'al-90-tri:b1<=c': [25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000]
};

describe('tabelas NBR 5410 — forma dos arquivos', () => {
    it('a matriz de tabelas esta completa e sem arquivo extra', () => {
        const encontrados = fs.readdirSync(DIR_JSON).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')).sort();
        expect(encontrados).toEqual(NOMES);
        expect(encontrados).toHaveLength(68);
    });

    it.each(NOMES)('%s tem registros bem formados', (nome) => {
        const tabela = TABELAS.get(nome)!;
        expect(Array.isArray(tabela), `${nome} deveria ser um array`).toBe(true);
        expect(tabela.length, `${nome} esta vazio`).toBeGreaterThan(0);

        for (const [indice, registro] of tabela.entries()) {
            const contexto = `${nome}[${indice}]`;
            expect(Object.keys(registro).sort(), `${contexto} tem chaves inesperadas`).toEqual(['max_current', 'wire']);
            expect(Number.isFinite(registro.max_current), `${contexto}.max_current nao e numero finito`).toBe(true);
            expect(Number.isFinite(registro.wire), `${contexto}.wire nao e numero finito`).toBe(true);
            expect(registro.max_current, `${contexto}.max_current deve ser positivo`).toBeGreaterThan(0);
            expect(ALL_WIRES, `${contexto}.wire=${registro.wire} nao e secao nominal`).toContain(registro.wire);
        }
    });

    it.each(NOMES)('%s cobre uma faixa contigua de secoes nominais, sem lacuna', (nome) => {
        const bitolas = [...new Set(TABELAS.get(nome)!.map((r) => r.wire))].sort((a, b) => a - b);
        const primeiro = ALL_WIRES.indexOf(bitolas[0]);
        const ultimo = ALL_WIRES.indexOf(bitolas[bitolas.length - 1]);

        expect(bitolas, `${nome} pula secoes nominais intermediarias`).toEqual(ALL_WIRES.slice(primeiro, ultimo + 1));
        expect(bitolas[bitolas.length - 1], `${nome} nao chega a 1000 mm²`).toBe(1000);
    });

    it('o numero de linhas de cada tabela corresponde ao snapshot versionado', () => {
        const atual = Object.fromEntries(NOMES.map((nome) => [nome, TABELAS.get(nome)!.length]));
        expect(atual).toEqual(LINHAS_ESPERADAS);
    });
});

describe('tabelas NBR 5410 — coerencia interna de cada arquivo', () => {
    it.each(NOMES)('%s esta ordenado por max_current crescente', (nome) => {
        const correntes = TABELAS.get(nome)!.map((r) => r.max_current);
        expect(correntes, `${nome} esta fora de ordem de max_current`).toEqual([...correntes].sort((a, b) => a - b));
    });

    it.each(NOMES.filter((n) => !ehAgrupado(n)))('%s nao repete bitola', (nome) => {
        const bitolas = TABELAS.get(nome)!.map((r) => r.wire);
        expect(bitolas, `${nome} tem bitola duplicada`).toEqual([...new Set(bitolas)]);
    });

    it.each(NOMES.filter(ehAgrupado))('%s tem no maximo duas configuracoes por bitola', (nome) => {
        const contagem = new Map<number, number>();
        for (const registro of TABELAS.get(nome)!) contagem.set(registro.wire, (contagem.get(registro.wire) ?? 0) + 1);

        const excedentes = [...contagem.entries()].filter(([, n]) => n > 2);
        expect(excedentes, `${nome} tem bitola com mais de duas configuracoes`).toEqual([]);
    });

    it.each(NOMES.filter((n) => !ehAgrupado(n)))('%s nunca retrocede de bitola conforme max_current cresce', (nome) => {
        const tabela = [...TABELAS.get(nome)!].sort((a, b) => a.max_current - b.max_current);
        const retrocessos: string[] = [];
        for (let i = 1; i < tabela.length; i++) if (tabela[i].wire < tabela[i - 1].wire) retrocessos.push(`${tabela[i].max_current}A/${tabela[i].wire}mm² vem apos ${tabela[i - 1].max_current}A/${tabela[i - 1].wire}mm²`);

        expect(retrocessos, `${nome}: max_current cresce mas a bitola diminui`).toEqual([]);
    });

    it.each(NOMES)('%s tem ampacidade estritamente crescente com a bitola', (nome) => {
        for (const [rotulo, serie] of [['piso', ampacidadePiso(nome)], ['teto', ampacidadeTeto(nome)]] as [string, Map<number, number>][]) {
            const bitolas = [...serie.keys()].sort((a, b) => a - b);
            const quebras: string[] = [];
            for (let i = 1; i < bitolas.length; i++) if (serie.get(bitolas[i])! <= serie.get(bitolas[i - 1])!) quebras.push(`${bitolas[i]}mm²=${serie.get(bitolas[i])}A nao supera ${bitolas[i - 1]}mm²=${serie.get(bitolas[i - 1])}A`);

            expect(quebras, `${nome} (serie ${rotulo}): ampacidade nao cresce com a bitola`).toEqual([]);
        }
    });
});

describe('tabelas NBR 5410 — coerencia entre tabelas vizinhas', () => {
    const combinacoes: [string, string, string][] = [];
    for (const material of MATERIAIS) for (const isolacao of ISOLACOES) for (const fases of FASES) combinacoes.push([material, isolacao, fases]);

    it.each(combinacoes)('%s-%s-%s respeita a ordem de ampacidade entre metodos de instalacao', (material, isolacao, fases) => {
        for (let i = 0; i < CADEIA_METODOS.length - 1; i++) {
            const menor = CADEIA_METODOS[i];
            const maior = CADEIA_METODOS[i + 1];
            const catalogadas = INVERSOES_NAO_RESOLVIDAS[`${material}-${isolacao}-${fases}:${menor}<=${maior}`] ?? [];

            const ampMenor = ampacidadePiso(`${material}-${isolacao}-${fases}-${menor}`);
            const ampMaior = ampacidadePiso(`${material}-${isolacao}-${fases}-${maior}`);

            const invertidas = [...ampMenor.keys()]
                .filter((bitola) => ampMaior.has(bitola) && ampMaior.get(bitola)! < ampMenor.get(bitola)!)
                .filter((bitola) => !catalogadas.includes(bitola))
                .map((bitola) => `${bitola}mm²: ${menor}=${ampMenor.get(bitola)}A > ${maior}=${ampMaior.get(bitola)}A`);

            expect(invertidas, `${material}-${isolacao}-${fases}: ${menor} deveria dissipar menos que ${maior}`).toEqual([]);
        }
    });

    it('o catalogo de inversoes nao resolvidas continua descrevendo a realidade', () => {
        for (const [chave, bitolas] of Object.entries(INVERSOES_NAO_RESOLVIDAS)) {
            const [prefixo, par] = chave.split(':');
            const [menor, maior] = par.split('<=');
            const ampMenor = ampacidadePiso(`${prefixo}-${menor}`);
            const ampMaior = ampacidadePiso(`${prefixo}-${maior}`);

            const aindaInvertidas = bitolas.filter((bitola) => ampMaior.get(bitola)! < ampMenor.get(bitola)!);
            expect(aindaInvertidas, `${chave}: bitolas ja corrigidas devem sair do catalogo INVERSOES_NAO_RESOLVIDAS`).toEqual(bitolas);
        }
    });

    it.each(ISOLACOES.flatMap((isolacao) => FASES.flatMap((fases) => METODOS.map((metodo) => [isolacao, fases, metodo]))))(
        'cobre supera aluminio em %s°C-%s-%s',
        (isolacao, fases, metodo) => {
            if (metodo === 'g' && fases !== 'tri') return;
            const cobre = ampacidadePiso(`cu-${isolacao}-${fases}-${metodo}`);
            const aluminio = ampacidadePiso(`al-${isolacao}-${fases}-${metodo}`);

            const quebras = [...aluminio.keys()]
                .filter((bitola) => cobre.has(bitola) && cobre.get(bitola)! <= aluminio.get(bitola)!)
                .map((bitola) => `${bitola}mm²: cu=${cobre.get(bitola)}A <= al=${aluminio.get(bitola)}A`);

            expect(quebras, `cobre deveria conduzir mais que aluminio em ${isolacao}°C-${fases}-${metodo}`).toEqual([]);
        }
    );

    it.each(MATERIAIS.flatMap((material) => FASES.flatMap((fases) => METODOS.map((metodo) => [material, fases, metodo]))))(
        '90°C supera 70°C em %s-%s-%s',
        (material, fases, metodo) => {
            if (metodo === 'g' && fases !== 'tri') return;
            const quente = ampacidadePiso(`${material}-90-${fases}-${metodo}`);
            const frio = ampacidadePiso(`${material}-70-${fases}-${metodo}`);

            const quebras = [...frio.keys()]
                .filter((bitola) => quente.has(bitola) && quente.get(bitola)! <= frio.get(bitola)!)
                .map((bitola) => `${bitola}mm²: 90°C=${quente.get(bitola)}A <= 70°C=${frio.get(bitola)}A`);

            expect(quebras, `a isolacao 90°C deveria admitir mais corrente que a 70°C em ${material}-${fases}-${metodo}`).toEqual([]);
        }
    );

    it.each(MATERIAIS.flatMap((material) => ISOLACOES.flatMap((isolacao) => METODOS.filter((m) => m !== 'g').map((metodo) => [material, isolacao, metodo]))))(
        'dois condutores carregados admitem mais corrente que tres em %s-%s-%s',
        (material, isolacao, metodo) => {
            const bifasico = ampacidadePiso(`${material}-${isolacao}-bi-${metodo}`);
            const trifasico = ampacidadePiso(`${material}-${isolacao}-tri-${metodo}`);

            const quebras = [...trifasico.keys()]
                .filter((bitola) => bifasico.has(bitola) && bifasico.get(bitola)! < trifasico.get(bitola)!)
                .map((bitola) => `${bitola}mm²: bi=${bifasico.get(bitola)}A < tri=${trifasico.get(bitola)}A`);

            expect(quebras, `o bifasico deveria admitir ao menos a corrente do trifasico em ${material}-${isolacao}-${metodo}`).toEqual([]);
        }
    );
});
