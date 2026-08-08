import { describe, it, expect } from 'vitest';
import { overArgs } from './overArgs';

describe('overArgs', () => {
    it('transforma cada argumento pela função correspondente', () => {
        const square = (n: number) => n * n;
        const doubled = (n: number) => n * 2;
        const func = overArgs((x: number, y: number) => [x, y], [square, doubled]);
        expect(func(9, 3)).toEqual([81, 6]);
    });

    it('argumentos extras sem transform correspondente passam intocados', () => {
        const square = (n: number) => n * n;
        const func = overArgs((x: number, y: number, z: number) => [x, y, z], [square]);
        expect(func(9, 3, 5)).toEqual([81, 3, 5]);
    });

    it('aceita transforms variádicos (sem array)', () => {
        const square = (n: number) => n * n;
        const doubled = (n: number) => n * 2;
        const func = overArgs((x: number, y: number) => [x, y], square, doubled);
        expect(func(9, 3)).toEqual([81, 6]);
    });

    it('transforms passam por iteratee (atalho de propriedade)', () => {
        const func = overArgs((x: unknown, y: unknown) => [x, y], ['a', 'b']);
        expect(func({ a: 1, other: 2 }, { b: 5 })).toEqual([1, 5]);
    });

    it('sem transforms, repassa os argumentos originais', () => {
        const func = overArgs((x: number, y: number) => [x, y], []);
        expect(func(1, 2)).toEqual([1, 2]);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => overArgs(null as any, [])).toThrow(TypeError);
    });
});
