import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { invokeMap } from './invokeMap';

describe('invokeMap', () => {
    it('invoca o método no caminho para cada elemento', () => {
        expect(invokeMap([[1, 2, 3], [4, 5]], 'slice', 1)).toEqual([[2, 3], [5]]);
    });

    it('peculiaridade: path como função é invocada diretamente com this ligado ao elemento', () => {
        const objs = [{ a: 1 }, { a: 2 }];
        expect(invokeMap(objs, function (this: { a: number }) { return this.a * 2; })).toEqual([2, 4]);
    });

    it('funciona com objeto, iterando pelos valores', () => {
        expect(invokeMap({ x: [1, 2], y: [3, 4] }, 'slice', 1)).toEqual([[2], [4]]);
    });

    it('retorna vazio para coleção null ou undefined', () => {
        expect(invokeMap(null, 'slice')).toEqual([]);
    });

    it('funciona com Ref', () => {
        expect(invokeMap(ref([[1, 2, 3]]), 'slice', 1)).toEqual([[2, 3]]);
    });
});
