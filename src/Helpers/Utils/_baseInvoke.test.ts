import { describe, it, expect } from 'vitest';
import { baseInvoke } from './_baseInvoke';

describe('baseInvoke', () => {
    it('invoca método no caminho com argumentos e contexto correto', () => {
        const obj = {
            a: {
                b(x: number, y: number) {
                    return x + y;
                }
            }
        };
        expect(baseInvoke(obj, 'a.b', [10, 20])).toBe(30);
    });

    it('retorna undefined se a propriedade não for uma função', () => {
        const obj = { a: { b: 123 } };
        expect(baseInvoke(obj, 'a.b', [])).toBeUndefined();
        expect(baseInvoke(obj, 'a.c', [])).toBeUndefined();
    });
});
