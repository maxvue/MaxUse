import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import './wrapperNext';
import './wrapperToIterator';

describe('wrapperToIterator (método de instância [Symbol.iterator])', () => {
    it('retorna a própria instância', () => {
        const w = chain([1, 2, 3]);
        expect(w[Symbol.iterator]()).toBe(w);
    });

    it('torna o wrapper iterável com Array.from', () => {
        const w = chain([1, 2, 3]);
        expect(Array.from(w)).toEqual([1, 2, 3]);
    });

    it('torna o wrapper iterável com for...of', () => {
        const w = chain(['a', 'b']);
        const collected: string[] = [];
        for (const v of w) collected.push(v as string);
        expect(collected).toEqual(['a', 'b']);
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2]));
        expect(Array.from(w)).toEqual([1, 2]);
    });
});
