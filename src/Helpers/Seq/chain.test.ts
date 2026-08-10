import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { MaxUseWrapper } from './_MaxUseWrapper';
import './thru'; // registra o método de instância .thru() usado neste teste
import './tap'; // registra o método de instância .tap() usado neste teste

describe('chain', () => {
    it('cria um wrapper de encadeamento a partir de um valor', () => {
        const w = chain([1, 2, 3]);
        expect(w).toBeInstanceOf(MaxUseWrapper);
        expect(w.value()).toEqual([1, 2, 3]);
    });

    it('wrapper com chaining explícito: __chain__ fica habilitado', () => {
        const w = chain([1, 2, 3]);
        expect(w.__chain__).toBe(true);
    });

    it('permite encadear via thru de instância e resolver com value()', () => {
        const w = chain([1, 2, 3]).thru((arr) => (arr as number[]).map((x) => x * 2));
        expect(w).toBeInstanceOf(MaxUseWrapper);
        expect(w.value()).toEqual([2, 4, 6]);
    });

    it('permite encadear via tap de instância (efeito colateral, mesmo valor) e resolver com value()', () => {
        const spy: unknown[] = [];
        const w = chain([1, 2, 3]).tap((v) => spy.push(v));
        expect(w).toBeInstanceOf(MaxUseWrapper);
        expect(w.value()).toEqual([1, 2, 3]);
        expect(spy).toEqual([[1, 2, 3]]);
    });

    it('funciona com objetos e primitivos', () => {
        expect(chain({ a: 1 }).value()).toEqual({ a: 1 });
        expect(chain(5).value()).toBe(5);
    });

    it('funciona com null/undefined', () => {
        expect(chain(null).value()).toBeNull();
        expect(chain(undefined).value()).toBeUndefined();
    });

    it('funciona com Ref', () => {
        const w = chain(ref([1, 2, 3]));
        expect(w.value()).toEqual([1, 2, 3]);
    });

    it('encadeia map/filter e resolve com value()', () => {
        expect((chain([1, 2, 3]) as any).map((x: number) => x * 2).value()).toEqual([2, 4, 6]);
    });

    it('serializa como o valor embrulhado, não como estado interno', () => {
        expect(JSON.stringify(chain([1, 2, 3]))).toBe('[1,2,3]');
        expect(chain([1, 2, 3]).valueOf()).toEqual([1, 2, 3]);
    });
});
