import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { wrapperReverse } from './wrapperReverse';
import './wrapperReverse';

describe('wrapperReverse (método de instância .reverse())', () => {
    it('inverte a ordem do array encadeado', () => {
        const w = chain([1, 2, 3]).reverse();
        expect(w.value()).toEqual([3, 2, 1]);
    });

    it('muta o array original (mesma semântica do helper reverse standalone)', () => {
        const array = [1, 2, 3];
        chain(array).reverse().value();
        expect(array).toEqual([3, 2, 1]);
    });

    it('retorna um wrapper encadeável', () => {
        const w = chain([1, 2, 3]).reverse();
        expect(typeof w.value).toBe('function');
    });

    it('funciona com null/undefined como valor, sem lançar', () => {
        expect(chain(null).reverse().value()).toBeNull();
        expect(chain(undefined).reverse().value()).toBeUndefined();
    });

    it('funciona com tipos errados (não-array), devolvendo o valor sem lançar', () => {
        expect(chain({ a: 1 }).reverse().value()).toEqual({ a: 1 });
        expect(chain(5).reverse().value()).toBe(5);
    });

    it('versão funcional wrapperReverse é equivalente ao método de instância', () => {
        const w = chain([1, 2, 3]);
        expect(wrapperReverse(w).value()).toEqual([3, 2, 1]);
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2, 3])).reverse();
        expect(w.value()).toEqual([3, 2, 1]);
    });
});
