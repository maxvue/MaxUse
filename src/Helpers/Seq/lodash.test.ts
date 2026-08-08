import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { lodash } from './lodash';
import { MaxUseWrapper } from './_MaxUseWrapper';

describe('lodash (alias de wrapperLodash — a própria função _ chamável)', () => {
    it('cria um wrapper a partir de um valor', () => {
        const w = lodash([1, 2, 3]);
        expect(w).toBeInstanceOf(MaxUseWrapper);
        expect(w.value()).toEqual([1, 2, 3]);
    });

    it('a própria função _ chamável: cria wrapper com encadeamento implícito', () => {
        const w = lodash([1, 2, 3]);
        expect(w.__chain__).toBe(false);
    });

    it('funciona com null/undefined', () => {
        expect(lodash(null).value()).toBeNull();
        expect(lodash(undefined).value()).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const w = lodash(ref([1, 2, 3]));
        expect(w.value()).toEqual([1, 2, 3]);
    });
});
