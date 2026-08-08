import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { remove } from './remove';

describe('remove', () => {
    it('remove em lugar os elementos que casam e retorna os removidos', () => {
        const arr = [1, 2, 3, 4];
        const removed = remove(arr, (x: number) => x % 2 === 0);
        expect(removed).toEqual([2, 4]);
        expect(arr).toEqual([1, 3]);
    });

    it('não muta o array quando nada casa', () => {
        const arr = [1, 3, 5];
        const removed = remove(arr, (x: number) => x % 2 === 0);
        expect(removed).toEqual([]);
        expect(arr).toEqual([1, 3, 5]);
    });

    it('remove todos quando tudo casa', () => {
        const arr = [1, 2, 3];
        const removed = remove(arr, () => true);
        expect(removed).toEqual([1, 2, 3]);
        expect(arr).toEqual([]);
    });

    it('retorna vazio para array null ou undefined', () => {
        expect(remove(null, () => true)).toEqual([]);
        expect(remove(undefined, () => true)).toEqual([]);
    });

    it('repassa índice e array original ao predicado', () => {
        const arr = [10, 20, 30];
        const seen: number[] = [];
        remove(arr, (_v: number, i: number) => { seen.push(i); return false; });
        expect(seen).toEqual([0, 1, 2]);
    });

    it('funciona com Ref (muta o array subjacente)', () => {
        const r = ref([1, 2, 3, 4]);
        const removed = remove(r, (x: number) => x > 2);
        expect(removed).toEqual([3, 4]);
        expect(r.value).toEqual([1, 2]);
    });
});
