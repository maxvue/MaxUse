import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { getFirst } from './getFirst';

describe('getFirst', () => {
    it('retorna o primeiro valor válido', () => {
        expect(getFirst(null, undefined, 'hello', 'world')).toBe('hello');
    });

    it('retorna undefined quando todos são inválidos', () => {
        expect(getFirst(null, undefined, '', '   ')).toBeUndefined();
    });

    it('ignora strings vazias e retorna o primeiro com conteúdo', () => {
        expect(getFirst('', '', 'valor')).toBe('valor');
    });

    it('retorna o primeiro número válido (diferente de 0)', () => {
        expect(getFirst(null, 5, 10)).toBe(5);
    });

    it('ignora 0 por padrão e retorna o próximo válido', () => {
        expect(getFirst(0, 42)).toBe(42);
    });

    it('retorna o primeiro objeto com conteúdo', () => {
        expect(getFirst(null, {}, { nome: 'teste' })).toEqual({ nome: 'teste' });
    });

    it('ignora arrays vazios', () => {
        expect(getFirst([], [1, 2])).toEqual([1, 2]);
    });

    it('funciona com Ref reativo', () => {
        const refValue = ref('reativo');
        expect(getFirst(null, refValue)).toBe('reativo');
    });

    it('retorna undefined para lista vazia de argumentos', () => {
        expect(getFirst()).toBeUndefined();
    });
});
