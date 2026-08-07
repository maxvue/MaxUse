import { describe, it, expect } from 'vitest';
import { flow } from './flow';

describe('flow', () => {
    it('compõe funções da esquerda para a direita', () => {
        const add = (a: number, b: number) => a + b;
        const square = (n: number) => n * n;
        const f = flow(add, square);
        expect(f(1, 2)).toBe(9);
    });

    it('repassa os argumentos originais apenas à primeira função', () => {
        const first = (a: number, b: number) => a + b;
        const second = (n: number) => n * 10;
        const f = flow(first, second);
        expect(f(2, 3)).toBe(50);
    });

    it('aceita as funções como um único array', () => {
        const add = (a: number, b: number) => a + b;
        const square = (n: number) => n * n;
        const f = flow([add, square]);
        expect(f(1, 2)).toBe(9);
    });

    it('sem funções, retorna o primeiro argumento', () => {
        const f = flow();
        expect(f(5, 6)).toBe(5);
        expect(f()).toBeUndefined();
    });

    it('lança TypeError na criação se algum item não for função', () => {
        expect(() => flow((a: unknown) => a, 'notafn' as any)).toThrow(TypeError);
    });

    it('preserva "this" em cada etapa', () => {
        const obj = {
            offset: 10,
            addOffset(this: { offset: number }, n: number) {
                return n + this.offset;
            },
            double(this: unknown, n: number) {
                return n * 2;
            }
        };
        const f = flow(obj.addOffset, obj.double);
        expect(f.call(obj, 5)).toBe(30);
    });
});
