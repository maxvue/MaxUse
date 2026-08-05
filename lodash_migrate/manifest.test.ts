import { describe, it, expect } from 'vitest';
import * as lodash from 'lodash-es';
import * as vueUse from '@vueuse/core';
import { HELPERS } from './manifest';
import { maxUseItems } from '../src/Helpers/maxUseItems';

/**
 * Helpers-semente implementados na Task 2 desta migração. Fazem parte dos 279
 * e por isso precisam ser descontados ao reconstruir a linha de base
 * pré-migração a partir de maxUseItems().
 */
const SEMENTES = ['isNil', 'negate', 'stubTrue', 'tap'];

/** Nomes do lodash-es que não existiam na MaxUse nem no VueUse antes desta migração. */
const faltantes = (): string[] => {
    const proprios = new Set(maxUseItems());
    for (const semente of SEMENTES) proprios.delete(semente);

    return Object.keys(lodash)
        .filter((k) => !proprios.has(k))
        .filter((k) => !(k in vueUse))
        .sort();
};

describe('manifest', () => {
    it('cobre exatamente os helpers faltantes da linha de base pré-migração, sem lacunas nem extras', () => {
        const alvo = new Set(faltantes());
        const nomes = new Set(HELPERS.map((h) => h.nome));

        expect([...alvo].filter((k) => !nomes.has(k))).toEqual([]);
        expect([...nomes].filter((k) => !alvo.has(k))).toEqual([]);
    });

    it('não contém nomes duplicados', () => {
        const nomes = HELPERS.map((h) => h.nome);
        expect(nomes.length).toBe(new Set(nomes).size);
    });

    it('só declara dependências que existem no manifesto ou já na MaxUse', () => {
        const nomes = new Set(HELPERS.map((h) => h.nome));
        const proprios = new Set(maxUseItems());
        const invalidas = HELPERS.flatMap((h) =>
            h.depende_de.filter((d) => !nomes.has(d) && !proprios.has(d)).map((d) => `${h.nome} -> ${d}`)
        );

        expect(invalidas).toEqual([]);
    });

    it('nunca depende de um helper de fase posterior', () => {
        const fases = new Map(HELPERS.map((h) => [h.nome, h.fase]));
        const invertidas = HELPERS.flatMap((h) =>
            h.depende_de
                .filter((d) => fases.has(d) && (fases.get(d) as number) > h.fase)
                .map((d) => `${h.nome}(f${h.fase}) -> ${d}(f${fases.get(d)})`)
        );

        expect(invertidas).toEqual([]);
    });

    it('todo alias declara o original em depende_de', () => {
        const semDependencia = HELPERS
            .filter((h) => h.alias_de)
            .filter((h) => !h.depende_de.includes(h.alias_de as string))
            .map((h) => h.nome);

        expect(semDependencia).toEqual([]);
    });
});
