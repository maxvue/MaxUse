import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import './thru';
import './wrapperCommit';

describe('wrapperCommit (método de instância .commit())', () => {
    it('resolve o valor encadeado e zera as ações pendentes', () => {
        const w = chain([1, 2]).thru((arr) => [...(arr as number[]), 3]);
        const committed = w.commit();
        expect(committed.value()).toEqual([1, 2, 3]);
        expect(committed.__actions__).toEqual([]);
    });

    it('não força a mutação do array original quando a ação encadeada não muta (thru com spread é imutável)', () => {
        // Nota: o exemplo oficial do Lodash usa `.push(3)`, um método mutante
        // que não faz parte dos 19 helpers desta fase — aqui a ação
        // encadeada (`thru` com spread) é intencionalmente imutável, então
        // o array original permanece intacto antes e depois do commit.
        const array = [1, 2];
        const wrapped = chain(array).thru((arr) => [...(arr as number[]), 3]);
        expect(array).toEqual([1, 2]);
        const committed = wrapped.commit();
        expect(committed.value()).toEqual([1, 2, 3]);
        expect(array).toEqual([1, 2]);
    });

    it('funciona com Ref', () => {
        const committed = chain(ref([1, 2])).commit();
        expect(committed.value()).toEqual([1, 2]);
    });

    it('retorna uma instância nova, não muta a instância original (mesma referência que .commit() foi chamado)', () => {
        const w = chain([1, 2]).thru((arr) => [...(arr as number[]), 3]);
        const committed = w.commit();
        expect(committed).not.toBe(w);
        expect(w.__actions__.length).toBe(1); // a instância original mantém sua fila de ações intacta
    });
});
