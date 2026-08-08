import { describe, it, expect } from 'vitest';
import { rest } from './rest';

describe('rest', () => {
    it('agrupa os argumentos a partir de func.length - 1 por padrão', () => {
        const say = rest((what: string, names: string[]) => `${what} ${names.join(' and ')}`);
        expect(say('hello', 'fred', 'barney', 'pebbles')).toBe('hello fred and barney and pebbles');
    });

    it('respeita start explícito', () => {
        const joinAll = rest((names: string[]) => names.join(' and '), 0);
        expect(joinAll('a', 'b', 'c')).toBe('a and b and c');
    });

    it('sem argumentos extras, agrupa array vazio', () => {
        const say = rest((what: string, names: string[]) => `${what} [${names.join(',')}]`);
        expect(say('hello')).toBe('hello []');
    });

    it('start negativo é grampeado em 0', () => {
        const all = rest((names: string[]) => names, -1);
        expect(all('x', 'y', 'z')).toEqual(['x', 'y', 'z']);
    });

    it('lança TypeError se func não for função', () => {
        expect(() => rest(null as any)).toThrow(TypeError);
    });

    it('preenche com undefined as posições anteriores a start quando faltam argumentos', () => {
        const list = (...args: unknown[]) => args;
        expect((rest(list, 3) as any)('a', 'b')).toEqual(['a', 'b', undefined, []]);
        const abc = rest((a: unknown, b: unknown, c: unknown[]) => [a, b, c], 2);
        expect((abc as any)('x')).toEqual(['x', undefined, []]);
    });
});
