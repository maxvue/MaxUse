import { describe, it, expect } from 'vitest';
import { wrap } from './wrap';

describe('wrap', () => {
    it('invoca wrapper com value prependado', () => {
        const p = wrap('hello', (fn) => `before_${fn}_after`);
        expect(p()).toBe('before_hello_after');
    });

    it('repassa os argumentos da chamada depois de value', () => {
        const sum = wrap(10, (base: number, add: number) => base + add);
        expect(sum(5)).toBe(15);
    });

    it('sem wrapper função, trata como identity', () => {
        const p = wrap(5, null as any);
        expect(p()).toBe(5);
    });

    it('permite compor uma função que transforma o value', () => {
        const double = wrap(5, (n: number) => n * 2);
        expect(double()).toBe(10);
    });
});
