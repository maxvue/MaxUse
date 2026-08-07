import { describe, it, expect } from 'vitest';
import { flowRight } from './flowRight';

describe('flowRight', () => {
    it('compõe funções da direita para a esquerda', () => {
        const add = (a: number, b: number) => a + b;
        const square = (n: number) => n * n;
        const f = flowRight(square, add);
        expect(f(1, 2)).toBe(9);
    });

    it('repassa os argumentos originais apenas à última função (mais à direita)', () => {
        const first = (a: number, b: number) => a + b;
        const second = (n: number) => n * 10;
        const f = flowRight(second, first);
        expect(f(2, 3)).toBe(50);
    });

    it('aceita as funções como um único array', () => {
        const add = (a: number, b: number) => a + b;
        const square = (n: number) => n * n;
        const f = flowRight([square, add]);
        expect(f(1, 2)).toBe(9);
    });

    it('sem funções, retorna o primeiro argumento', () => {
        const f = flowRight();
        expect(f(5, 6)).toBe(5);
    });

    it('lança TypeError na criação se algum item não for função', () => {
        expect(() => flowRight((a: unknown) => a, 'notafn' as any)).toThrow(TypeError);
    });
});
