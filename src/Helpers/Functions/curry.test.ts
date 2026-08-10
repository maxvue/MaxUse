import { describe, it, expect } from 'vitest';
import { curry } from './curry';
import { placeholder } from './partial';

describe('curry', () => {
    const abc = (a: number, b: number, c: number) => [a, b, c];

    it('curried por argumento único', () => {
        const curried = curry(abc);
        expect((curried(1) as any)(2)(3)).toEqual([1, 2, 3]);
    });

    it('curried com múltiplos argumentos por chamada', () => {
        const curried = curry(abc);
        expect((curried(1, 2) as any)(3)).toEqual([1, 2, 3]);
    });

    it('invocação completa direta', () => {
        const curried = curry(abc);
        expect(curried(1, 2, 3)).toEqual([1, 2, 3]);
    });

    it('mistura chamadas parciais', () => {
        const curried = curry(abc);
        expect((curried(1) as any)(2, 3)).toEqual([1, 2, 3]);
    });

    it('suporta placeholder para reservar posição', () => {
        const curried = curry(abc);
        expect((curried(1, placeholder, 3) as any)(2)).toEqual([1, 2, 3]);
    });

    it('aceita aridade explícita', () => {
        const curried = curry(abc, 2);
        expect((curried(1) as any)(2)).toEqual([1, 2, undefined]);
    });

    it('usa func.length como aridade padrão', () => {
        const sum3 = (a: number, b: number, c: number) => a + b + c;
        const curried = curry(sum3);
        expect((curried(1) as any)(2)(3)).toBe(6);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => curry(null as any)).toThrow(TypeError);
    });

    it('expõe .placeholder tanto em curry quanto na função curried', () => {
        expect((curry as any).placeholder).toBe(placeholder);
        const curried = curry(abc) as any;
        expect(curried.placeholder).toBe(placeholder);
    });

    it('reporta a aridade restante', () => {
        const cf = curry((_a: number, _b: number, _c: number) => 0);
        expect(cf.length).toBe(3);
        expect((cf(1) as any).length).toBe(2);
    });
});
