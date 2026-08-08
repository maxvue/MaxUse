import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { wrapperLodash } from './wrapperLodash';
import { wrapperChain } from './wrapperChain';
import './thru';
import './wrapperChain';

describe('wrapperChain (método de instância .chain())', () => {
    it('habilita __chain__ e preserva o valor', () => {
        const w = chain([1, 2, 3]).chain();
        expect(w.__chain__).toBe(true);
        expect(w.value()).toEqual([1, 2, 3]);
    });

    it('preserva ações já empilhadas', () => {
        const w = chain([1, 2, 3]).thru((arr) => (arr as number[]).length).chain();
        expect(w.value()).toBe(3);
    });

    it('a partir de um wrapper implícito (__chain__: false), muta a própria instância e retorna this', () => {
        const w = wrapperLodash([1, 2, 3]);
        expect(w.__chain__).toBe(false);
        const w2 = w.chain();
        expect(w2).toBe(w);
        expect(w.__chain__).toBe(true);
    });

    it('versão funcional wrapperChain também muta e retorna a mesma instância', () => {
        const w = wrapperLodash([1, 2]);
        const w2 = wrapperChain(w);
        expect(w2).toBe(w);
        expect(w.__chain__).toBe(true);
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2])).chain();
        expect(w.value()).toEqual([1, 2]);
    });
});
