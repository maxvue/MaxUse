import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import './thru';
import './wrapperPlant';

describe('wrapperPlant (método de instância .plant())', () => {
    it('cria um clone com novo valor raiz, preservando as ações', () => {
        const w = chain([1, 2]).thru((arr) => (arr as number[]).map((x) => x * 2));
        const other = w.plant([10, 20]);
        expect(other.value()).toEqual([20, 40]);
        expect(w.value()).toEqual([2, 4]);
    });

    it('retorna uma instância diferente da original', () => {
        const w = chain([1, 2]);
        const other = w.plant([3, 4]);
        expect(other).not.toBe(w);
    });

    it('preserva __chain__', () => {
        const w = chain([1, 2]);
        const other = w.plant([3, 4]);
        expect(other.__chain__).toBe(w.__chain__);
    });

    it('funciona com Ref', () => {
        const w = chain([1, 2]);
        const other = w.plant(ref([9, 9]));
        expect(other.value()).toEqual([9, 9]);
    });
});
