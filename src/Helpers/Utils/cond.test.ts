import { describe, it, expect } from 'vitest';
import { cond } from './cond';

describe('cond', () => {
    it('invoca a função do primeiro predicado que casar', () => {
        const fn = cond([
            [(x: number) => x > 10, () => 'big'],
            [(x: number) => x > 5, () => 'medium'],
            [() => true, () => 'small']
        ]);
        expect(fn(20)).toBe('big');
        expect(fn(7)).toBe('medium');
        expect(fn(1)).toBe('small');
    });

    it('retorna undefined quando nenhum predicado casa', () => {
        expect(cond([[() => false, () => 'x']])(1)).toBeUndefined();
    });

    it('retorna undefined para array de pares vazio', () => {
        expect(cond([])(1)).toBeUndefined();
    });

    it('peculiaridade: predicado passa por iteratee — aceita string como property', () => {
        const fn = cond([['a', () => 'has a']]);
        expect(fn({ a: 1 })).toBe('has a');
        expect(fn({})).toBeUndefined();
    });

    it('lança TypeError se algum par tiver função inválida', () => {
        expect(() => cond([['a', 'não é função' as unknown as () => unknown]])).toThrow(TypeError);
    });

    it('repassa argumentos e this para predicado e função', () => {
        const fn = cond([[(a: number, b: number) => a + b > 5, function (this: unknown, ...args: unknown[]) { const [a, b] = args as number[]; return (this as { base: number }).base + a + b; }]]);
        expect(fn.apply({ base: 100 }, [3, 4])).toBe(107);
    });
});
