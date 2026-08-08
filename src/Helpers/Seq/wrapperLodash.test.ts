import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { wrapperLodash } from './wrapperLodash';
import { MaxUseWrapper } from './_MaxUseWrapper';

describe('wrapperLodash', () => {
    it('cria um wrapper (a própria função _ chamável) a partir de um valor', () => {
        const w = wrapperLodash([1, 2, 3]);
        expect(w).toBeInstanceOf(MaxUseWrapper);
        expect(w.value()).toEqual([1, 2, 3]);
    });

    it('cria wrapper com encadeamento implícito (__chain__: false), diferente de chain()', () => {
        const w = wrapperLodash([1, 2, 3]);
        expect(w.__chain__).toBe(false);
    });

    it('funciona com objetos e primitivos', () => {
        expect(wrapperLodash({ a: 1 }).value()).toEqual({ a: 1 });
        expect(wrapperLodash(5).value()).toBe(5);
    });

    it('funciona com null/undefined', () => {
        expect(wrapperLodash(null).value()).toBeNull();
        expect(wrapperLodash(undefined).value()).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const w = wrapperLodash(ref([1, 2, 3]));
        expect(w.value()).toEqual([1, 2, 3]);
    });
});
