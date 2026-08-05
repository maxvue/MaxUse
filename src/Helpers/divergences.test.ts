import { describe, it, expect } from 'vitest';
import * as lodash from 'lodash-es';
import { _ } from '../index';
import { maxUseItems } from './maxUseItems';

/**
 * Nomes presentes tanto no Lodash quanto nos helpers próprios da MaxUse
 * (incluindo os reexportados via VueUse). A precedência é intencional:
 * os próprios (e o VueUse) vencem o Lodash — ver `src/index.ts` e
 * `lodash_migrate/DIVERGENCES.md`.
 */
const conflitos = (): string[] => {
    const proprios = new Set(maxUseItems());
    return Object.keys(lodash).filter((k) => proprios.has(k)).sort();
};

describe('divergências intencionais em relação ao Lodash', () => {
    it('a lista de nomes conflitantes não está vazia (sanity check)', () => {
        expect(conflitos().length).toBeGreaterThan(0);
    });

    it('nenhum nome conflitante aponta para a implementação do Lodash', () => {
        const vazados = conflitos().filter(
            (nome) => (_ as Record<string, unknown>)[nome] === (lodash as Record<string, unknown>)[nome]
        );

        expect(vazados).toEqual([]);
    });

    it('todos os nomes conflitantes continuam definidos em _', () => {
        const ausentes = conflitos().filter((nome) => (_ as Record<string, unknown>)[nome] === undefined);

        expect(ausentes).toEqual([]);
    });
});
