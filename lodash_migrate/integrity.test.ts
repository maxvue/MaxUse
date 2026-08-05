import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { HELPERS } from './manifest';

interface StatusItem {
    nome: string;
    categoria: string;
    fase: number;
    plano: string;
    depende_de: string[];
    tentativas: number;
    status_execucao: string;
    status_verificacao: string;
}

/**
 * Raiz do repositório (não `lodash_migrate/`): o campo `plano` do status.yaml
 * é relativo à raiz do repo (ex.: `lodash_migrate/plans/Lang/isNil.md`), não a
 * este diretório. Resolver a partir daqui duplicaria o prefixo e quebraria
 * todos os `fs.existsSync`.
 */
const RAIZ_MIGRACAO = path.resolve(__dirname);
const RAIZ_REPO = path.resolve(__dirname, '..');
const status = load(fs.readFileSync(path.resolve(RAIZ_MIGRACAO, 'status.yaml'), 'utf8')) as {
    total: number;
    fases: { id: number; nome: string }[];
    helpers: StatusItem[];
};

/**
 * Helpers-semente da Task 2, já implementados e verificados antes desta
 * migração formal começar. Único estado inicial diferente de
 * Aguardando/Aguardando/0 tentativas permitido no status.yaml.
 */
const SEMENTES = ['isNil', 'negate', 'stubTrue', 'tap'];

describe('integridade do conjunto lodash_migrate', () => {
    it('o status.yaml cobre exatamente o manifesto', () => {
        expect(status.helpers.length).toBe(HELPERS.length);
        expect(status.helpers.map((h) => h.nome).sort()).toEqual(HELPERS.map((h) => h.nome).sort());
    });

    it('existe um arquivo de plano para cada helper', () => {
        const ausentes = status.helpers
            .filter((h) => !fs.existsSync(path.resolve(RAIZ_REPO, h.plano)))
            .map((h) => h.plano);

        expect(ausentes).toEqual([]);
    });

    it('nenhum plano contém placeholders', () => {
        const suspeitos: string[] = [];

        for (const h of status.helpers) {
            const conteudo = fs.readFileSync(path.resolve(RAIZ_REPO, h.plano), 'utf8');
            if (/\bTBD\b|\bTODO\b|preencher aqui/i.test(conteudo)) suspeitos.push(h.plano);
        }

        expect(suspeitos).toEqual([]);
    });

    it('todo plano cita o caminho de destino e o de teste', () => {
        const incompletos = status.helpers.filter((h) => {
            const conteudo = fs.readFileSync(path.resolve(RAIZ_REPO, h.plano), 'utf8');
            return !conteudo.includes(`src/Helpers/${h.categoria}/${h.nome}.ts`)
                || !conteudo.includes(`src/Helpers/${h.categoria}/${h.nome}.test.ts`);
        }).map((h) => h.plano);

        expect(incompletos).toEqual([]);
    });

    it('as 4 sementes da Task 2 estão Concluído/Concluído e as 276 restantes Aguardando/Aguardando, todas com 0 tentativas', () => {
        const semTentativasZero = status.helpers.filter((h) => h.tentativas !== 0).map((h) => h.nome);
        expect(semTentativasZero).toEqual([]);

        const sementesInvalidas = status.helpers
            .filter((h) => SEMENTES.includes(h.nome))
            .filter((h) => h.status_execucao !== 'Concluído' || h.status_verificacao !== 'Concluído')
            .map((h) => h.nome);
        expect(sementesInvalidas).toEqual([]);
        expect(status.helpers.filter((h) => SEMENTES.includes(h.nome)).length).toBe(SEMENTES.length);

        const restantesInvalidos = status.helpers
            .filter((h) => !SEMENTES.includes(h.nome))
            .filter((h) => h.status_execucao !== 'Aguardando' || h.status_verificacao !== 'Aguardando')
            .map((h) => h.nome);
        expect(restantesInvalidos).toEqual([]);
        expect(status.helpers.filter((h) => !SEMENTES.includes(h.nome)).length).toBe(276);
    });

    it('declara as 5 fases', () => {
        expect(status.fases.map((f) => f.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('as 4 categorias novas existem no código-fonte', () => {
        for (const cat of ['Lang', 'Functions', 'Utils', 'Seq']) expect(fs.existsSync(path.resolve(RAIZ_REPO, 'src', 'Helpers', cat, 'index.ts'))).toBe(true);
    });

    it('os documentos de apoio existem', () => {
        for (const doc of ['CONVENTIONS.md', 'DIVERGENCES.md', 'execution.md']) expect(fs.existsSync(path.resolve(RAIZ_MIGRACAO, doc))).toBe(true);
    });
});
