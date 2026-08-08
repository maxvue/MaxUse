import { describe, it, expect } from 'vitest';
import { spread } from './spread';

describe('spread', () => {
    it('espalha o array recebido como argumentos individuais', () => {
        const say = spread((who: string, what: string) => `${who} says ${what}`);
        expect(say(['fred', 'hello'])).toBe('fred says hello');
    });

    it('respeita start, preservando argumentos anteriores', () => {
        const func = spread((a: string, b: string, c: string) => [a, b, c], 1);
        expect(func('x', ['y', 'z'])).toEqual(['x', 'y', 'z']);
    });

    it('array vazio ou ausente não adiciona argumentos', () => {
        const func = spread((...args: unknown[]) => args);
        expect(func(undefined as any)).toEqual([]);
    });

    it('valores truthy sem .length numérico (número, boolean, objeto simples) não são espalhados', () => {
        const func = spread((...args: unknown[]) => args);
        expect(func(5 as any)).toEqual([]);
        expect(func(true as any)).toEqual([]);
        expect(func({ a: 1 } as any)).toEqual([]);
    });

    it('objetos array-like (com .length numérico) são espalhados por índice', () => {
        const func = spread((...args: unknown[]) => args);
        expect(func({ 0: 'a', 1: 'b', length: 2 } as any)).toEqual(['a', 'b']);
    });

    it('string é espalhada caractere a caractere (é array-like)', () => {
        const func = spread((...args: unknown[]) => args);
        expect(func('abc' as any)).toEqual(['a', 'b', 'c']);
    });

    it('Set não é espalhado (não tem .length)', () => {
        const func = spread((...args: unknown[]) => args);
        expect(func(new Set([1, 2]) as any)).toEqual([]);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => spread(null as any)).toThrow(TypeError);
    });

    it('start negativo é grampeado em 0', () => {
        const say = spread((who: string, what: string) => `${who} says ${what}`, -5);
        expect(say(['fred', 'hello'])).toBe('fred says hello');
    });
});
