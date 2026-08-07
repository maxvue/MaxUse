import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { value } from './value';
import './thru';

describe('value (alias de wrapperValue)', () => {
    it('resolve o valor desembrulhado', () => {
        expect(value(chain([1, 2, 3]))).toEqual([1, 2, 3]);
    });

    it('resolve após ações encadeadas', () => {
        const w = chain([1, 2, 3]).thru((arr) => (arr as number[]).map((x) => x * 2));
        expect(value(w)).toEqual([2, 4, 6]);
    });

    it('é o mesmo comportamento de wrapperValue', () => {
        const w = chain({ a: 1 });
        expect(value(w)).toEqual({ a: 1 });
    });

    it('funciona com Ref', () => {
        expect(value(chain(ref([1, 2])))).toEqual([1, 2]);
    });
});
