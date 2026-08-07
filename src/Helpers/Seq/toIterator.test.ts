import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { toIterator } from './toIterator';
import './wrapperNext';

describe('toIterator (alias de wrapperToIterator)', () => {
    it('retorna a própria instância, tornando-a iterável', () => {
        const w = chain([1, 2, 3]);
        expect(toIterator(w)).toBe(w);
    });

    it('permite Array.from sobre o resultado', () => {
        const w = chain([1, 2, 3]);
        toIterator(w);
        expect(Array.from(w)).toEqual([1, 2, 3]);
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2]));
        expect(toIterator(w)).toBe(w);
    });
});
