import { describe, it, expect } from 'vitest';
import { ary } from './ary';

describe('ary', () => {
    it('limita o número de argumentos repassados', () => {
        const parseIntLike = (str: string, radix: number) => `${str}-${radix}`;
        const limited = ary(parseIntLike, 1);
        expect(limited('10', 2)).toBe('10-undefined');
    });

    it('sem n, usa func.length como aridade', () => {
        const sum = (a: number, b: number) => a + b;
        const limited = ary(sum);
        expect(limited(1, 2, 3, 4)).toBe(3);
    });

    it('n maior que os argumentos passados não afeta o resultado', () => {
        const sum = (a: number, b: number) => (a ?? 0) + (b ?? 0);
        const limited = ary(sum, 5);
        expect(limited(1, 2)).toBe(3);
    });

    it('n = 0 não repassa nenhum argumento', () => {
        const func = (a?: number) => a;
        const limited = ary(func, 0);
        expect(limited(5)).toBeUndefined();
    });

    it('caso de uso clássico: map + parseInt sem vazar índice', () => {
        const results = ['6', '8', '10'].map(ary(Number, 1));
        expect(results).toEqual([6, 8, 10]);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => ary(null as any)).toThrow(TypeError);
    });

    it('n negativo é grampeado em 0 (nenhum argumento repassado)', () => {
        const list = (...args: unknown[]) => args;
        const limited = ary(list, -1);
        expect(limited('a', 'b', 'c')).toEqual([]);
        expect(ary(list, -5)('a', 'b', 'c')).toEqual([]);
    });
});
