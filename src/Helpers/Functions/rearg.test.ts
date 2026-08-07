import { describe, it, expect } from 'vitest';
import { rearg } from './rearg';

describe('rearg', () => {
    it('reordena os argumentos conforme os índices', () => {
        const func = rearg((a: string, b: string, c: string) => [a, b, c], [2, 0, 1]);
        expect(func('b', 'c', 'a')).toEqual(['a', 'b', 'c']);
    });

    it('aceita índices variádicos (sem array)', () => {
        const func = rearg((a: string, b: string, c: string) => [a, b, c], 2, 0, 1);
        expect(func('b', 'c', 'a')).toEqual(['a', 'b', 'c']);
    });

    it('posições sem índice correspondente mantêm o argumento original', () => {
        const func = rearg((a: string, b: string, c: string, d: string) => [a, b, c, d], [1, 0]);
        expect(func('x', 'y', 'z', 'w')).toEqual(['y', 'x', 'z', 'w']);
    });

    it('índice fora do alcance vira undefined', () => {
        const func = rearg((a: unknown) => [a], [5]);
        expect(func('x')).toEqual([undefined]);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => rearg(null as any, [0])).toThrow(TypeError);
    });
});
