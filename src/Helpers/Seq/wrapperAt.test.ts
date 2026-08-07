import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { chain } from './chain';
import { wrapperAt } from './wrapperAt';
import './wrapperAt';

describe('wrapperAt (método de instância .at() do wrapper)', () => {
    it('aceita um array de caminhos', () => {
        const obj = { a: [{ b: { c: 3 } }, 4] };
        const result = chain(obj).at(['a[0].b.c', 'a[1]']).value();
        expect(result).toEqual([3, 4]);
    });

    it('aceita múltiplos caminhos como argumentos separados', () => {
        const obj = { a: [{ b: { c: 3 } }, 4] };
        const result = chain(obj).at('a[0].b.c', 'a[1]').value();
        expect(result).toEqual([3, 4]);
    });

    it('retorna undefined para caminho inexistente', () => {
        const result = chain({ a: 1 }).at('nope').value();
        expect(result).toEqual([undefined]);
    });

    it('retorna um wrapper encadeável, não o valor direto', () => {
        const w = chain({ a: 1 }).at('a');
        expect(typeof w.value).toBe('function');
    });

    it('funciona com Ref', () => {
        const result = chain(ref({ a: [1, 2] })).at('a[0]').value();
        expect(result).toEqual([1]);
    });

    it('versão funcional wrapperAt é equivalente ao método de instância', () => {
        const w = chain({ a: [{ b: 1 }] });
        expect(wrapperAt(w, 'a[0].b').value()).toEqual([1]);
    });
});
