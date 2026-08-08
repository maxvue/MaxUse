import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { nthArg } from './nthArg';

describe('nthArg', () => {
    it('cria função que retorna o argumento no índice n', () => {
        const second = nthArg(1);
        expect(second('a', 'b', 'c')).toBe('b');
    });

    it('índice negativo conta a partir do fim (peculiaridade)', () => {
        const secondToLast = nthArg(-2);
        expect(secondToLast('a', 'b', 'c', 'd')).toBe('c');
    });

    it('retorna undefined quando o índice está fora do alcance', () => {
        const tenth = nthArg(10);
        expect(tenth('a', 'b')).toBeUndefined();
    });

    it('sem argumento, retorna o primeiro argumento recebido', () => {
        const first = nthArg();
        expect(first('a', 'b')).toBe('a');
    });

    it('funciona com Ref', () => {
        const second = nthArg(ref(1));
        expect(second('a', 'b')).toBe('b');
    });

    it('retorna undefined quando o índice negativo fica fora do alcance após somar length (peculiaridade)', () => {
        const f = nthArg(-2);
        expect(f('a')).toBeUndefined();
    });
});
