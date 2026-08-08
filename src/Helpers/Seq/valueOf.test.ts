import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { valueOf } from './valueOf';
import './thru';

describe('valueOf (alias de wrapperValue)', () => {
    it('resolve o valor desembrulhado', () => {
        const w = chain([1, 2, 3]);
        expect(valueOf(w)).toEqual([1, 2, 3]);
    });

    it('resolve após ações encadeadas', () => {
        const w = chain([1, 2, 3]).thru((arr) => (arr as number[]).map((x) => x * 2));
        expect(valueOf(w)).toEqual([2, 4, 6]);
    });

    it('funciona com Ref', () => {
        expect(valueOf(chain(ref([1, 2])))).toEqual([1, 2]);
    });
});
