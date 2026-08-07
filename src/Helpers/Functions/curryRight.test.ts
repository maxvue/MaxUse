import { describe, it, expect } from 'vitest';
import { curryRight } from './curryRight';
import { placeholder } from './partial';

describe('curryRight', () => {
    const abc = (a: number, b: number, c: number) => [a, b, c];

    it('acumula os argumentos pela direita', () => {
        const curried = curryRight(abc) as any;
        expect(curried(3)(2)(1)).toEqual([1, 2, 3]);
    });

    it('múltiplos argumentos por chamada continuam acumulando pela direita', () => {
        const curried = curryRight(abc) as any;
        expect(curried(2, 3)(1)).toEqual([1, 2, 3]);
    });

    it('invocação completa direta preserva a ordem normal', () => {
        const curried = curryRight(abc);
        expect(curried(1, 2, 3)).toEqual([1, 2, 3]);
    });

    it('novo grupo de argumentos fica antes dos já acumulados', () => {
        const curried = curryRight(abc) as any;
        expect(curried(3)(2, 1)).toEqual([2, 1, 3]);
    });

    it('suporta placeholder', () => {
        const curried = curryRight(abc) as any;
        expect(curried(3, placeholder)(2)(1)).toEqual([1, 3, 2]);
    });

    it('caso com aridade 4 e múltiplos placeholders', () => {
        const list = (...args: unknown[]) => args;
        const c = curryRight(list, 4) as any;
        expect(c(1)(2)(3)(4)).toEqual([4, 3, 2, 1]);
        expect(curryRight(list, 4)(1, 2)(3, 4)).toEqual([3, 4, 1, 2]);
    });

    it('repassa argumentos em excesso à função original, sem truncar', () => {
        const list = (...args: unknown[]) => args;
        expect((curryRight(list, 2) as any)(1, 2, 3)).toEqual([1, 2, 3]);
        expect((curryRight(list, 3) as any)(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
        expect((curryRight(list, 2) as any)(3)(1, 2)).toEqual([1, 2, 3]);
    });

    it('excesso de argumentos combinado com placeholder', () => {
        const list = (...args: unknown[]) => args;
        expect((curryRight(list, 2) as any)(placeholder, 'x')(1, 2, 3)).toEqual([1, 2, 3, 'x']);
    });

    it('múltiplos placeholders preenchidos em chamadas sucessivas (uma posição por chamada)', () => {
        const list = (...args: unknown[]) => args;
        const c = curryRight(list, 4) as any;
        expect(c(placeholder, placeholder, 4)(1)(2)(3)).toEqual([3, 1, 2, 4]);
        expect(curryRight(list, 4)(placeholder, placeholder, placeholder, 4)(1)(2)(3)).toEqual([1, 2, 3, 4]);
    });

    it('múltiplos placeholders preenchidos com grupos de argumentos maiores que 1', () => {
        const list = (...args: unknown[]) => args;
        expect((curryRight(list, 4) as any)(placeholder, placeholder, 4)(1)(2, 3)).toEqual([2, 1, 3, 4]);
        expect((curryRight(list, 4) as any)(placeholder, 3, placeholder)(1)(2, 4)).toEqual([2, 1, 3, 4]);
        expect((curryRight(list, 4) as any)(placeholder, 3, placeholder)(4)(1, 2)).toEqual([1, 4, 3, 2]);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => curryRight(null as any)).toThrow(TypeError);
    });

    it('expõe .placeholder', () => {
        expect((curryRight as any).placeholder).toBe(placeholder);
    });
});
