import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { merge } from './merge';

describe('merge', () => {
    it('mescla objetos aninhados profundamente', () => {
        expect(merge({ a: { x: 1 } }, { a: { y: 2 } }, { b: 3 })).toEqual({ a: { x: 1, y: 2 }, b: 3 });
    });

    it('peculiaridade: arrays são mesclados por índice, não concatenados', () => {
        expect(merge({ a: [1, 2, 3] }, { a: [4] })).toEqual({ a: [4, 2, 3] });
    });

    it('peculiaridade: undefined na fonte nunca sobrescreve valor existente', () => {
        expect(merge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
        expect(merge({ a: [1, 2, 3] }, { a: [undefined, 5] })).toEqual({ a: [1, 5, 3] });
    });

    it('null na fonte sobrescreve (não é undefined)', () => {
        expect(merge({ a: { x: 1 } }, { a: null })).toEqual({ a: null });
    });

    it('valor primitivo é substituído por objeto quando a fonte traz um objeto', () => {
        expect(merge({ a: 1 }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
    });

    it('trata object null/undefined como um novo objeto vazio', () => {
        expect(merge(null, { a: 1 })).toEqual({ a: 1 });
    });

    it('funciona com Ref', () => {
        expect(merge(ref({ a: { x: 1 } }), { a: { y: 2 } })).toEqual({ a: { x: 1, y: 2 } });
    });

    it('peculiaridade: fonte string é tratada como array-like e mesclada por índice', () => {
        expect(merge({ a: 1 }, 'ab')).toEqual({ 0: 'a', 1: 'b', a: 1 });
    });

    it('fonte falsy (0, string vazia) é ignorada', () => {
        expect(merge({ a: 1 }, 0)).toEqual({ a: 1 });
        expect(merge({ a: 1 }, '')).toEqual({ a: 1 });
    });
});
