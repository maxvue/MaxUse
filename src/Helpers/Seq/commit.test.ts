import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { commit } from './commit';
import './thru';

describe('commit (alias de wrapperCommit)', () => {
    it('resolve a fila de ações e zera as ações pendentes', () => {
        const w = chain([1, 2]).thru((arr) => [...(arr as number[]), 3]);
        const committed = commit(w);
        expect(committed.value()).toEqual([1, 2, 3]);
        expect(committed.__actions__).toEqual([]);
    });

    it('é o mesmo comportamento de wrapperCommit', () => {
        const w = chain([1]);
        expect(commit(w).value()).toEqual([1]);
    });

    it('funciona com Ref', () => {
        const committed = commit(chain(ref([1, 2])));
        expect(committed.value()).toEqual([1, 2]);
    });
});
