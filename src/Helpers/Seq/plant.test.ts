import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { plant } from './plant';
import './thru';

describe('plant (alias de wrapperPlant)', () => {
    it('cria um clone com novo valor raiz, preservando as ações', () => {
        const w = chain([1, 2]).thru((arr) => (arr as number[]).map((x) => x * 2));
        const other = plant(w, [10, 20]);
        expect(other.value()).toEqual([20, 40]);
        expect(w.value()).toEqual([2, 4]);
    });

    it('é o mesmo comportamento de wrapperPlant', () => {
        const w = chain([1, 2]);
        expect(plant(w, [9]).value()).toEqual([9]);
    });

    it('funciona com Ref', () => {
        const w = chain([1, 2]);
        const other = plant(w, ref([9, 9]));
        expect(other.value()).toEqual([9, 9]);
    });
});
