import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { wrapperValue } from './wrapperValue';
import './thru';

describe('wrapperValue', () => {
    it('resolve o valor desembrulhado de um wrapper simples', () => {
        const w = chain([1, 2, 3]);
        expect(wrapperValue(w)).toEqual([1, 2, 3]);
    });

    it('resolve o valor após ações encadeadas', () => {
        const w = chain([1, 2, 3]).thru((arr) => (arr as number[]).map((x) => x * 2));
        expect(wrapperValue(w)).toEqual([2, 4, 6]);
    });

    it('funciona com wrapper de null/undefined', () => {
        expect(wrapperValue(chain(null))).toBeNull();
        expect(wrapperValue(chain(undefined))).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2]));
        expect(wrapperValue(w)).toEqual([1, 2]);
    });
});
