import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { slice } from './slice';

describe('slice', () => {
    it('extrai fatia entre start e end', () => {
        expect(slice([1, 2, 3, 4], 1, 3)).toEqual([2, 3]);
    });

    it('aceita índice negativo', () => {
        expect(slice([1, 2, 3, 4], -2)).toEqual([3, 4]);
    });

    it('usa array completo sem start/end', () => {
        expect(slice([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('versão lodash não é a nativa: coage start/end não numéricos via toInteger', () => {
        expect(slice([1, 2, 3, 4], '1' as any, '3' as any)).toEqual([2, 3]);
        expect(slice([1, 2, 3, 4], NaN as any, 2)).toEqual([1, 2]);
    });

    it('retorna vazio para array vazio', () => {
        expect(slice([], 0, 1)).toEqual([]);
    });

    it('retorna vazio para null', () => {
        expect(slice(null, 0, 1)).toEqual([]);
    });

    it('não muta o array original', () => {
        const original = [1, 2, 3];
        slice(original, 0, 2);
        expect(original).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        expect(slice(ref([1, 2, 3, 4]), 1, 3)).toEqual([2, 3]);
    });
});
