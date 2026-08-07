import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { next } from './next';

describe('next (alias de wrapperNext)', () => {
    it('itera valores até done: true', () => {
        const w = chain([1, 2]);
        expect(next(w)).toEqual({ done: false, value: 1 });
        expect(next(w)).toEqual({ done: false, value: 2 });
        expect(next(w)).toEqual({ done: true, value: undefined });
    });

    it('é o mesmo comportamento de wrapperNext', () => {
        const w = chain(['a']);
        expect(next(w)).toEqual({ done: false, value: 'a' });
    });

    it('funciona com Ref', () => {
        const w = chain(ref([5]));
        expect(next(w)).toEqual({ done: false, value: 5 });
    });
});
