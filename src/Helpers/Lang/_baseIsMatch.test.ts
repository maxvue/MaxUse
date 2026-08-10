import { describe, it, expect } from 'vitest';
import { baseIsMatch } from './_baseIsMatch';

describe('baseIsMatch', () => {
    it('retorna true para objetos equivalentes ou parciais', () => {
        expect(baseIsMatch({ a: 1, b: 2 }, { a: 1 })).toBe(true);
        expect(baseIsMatch({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('retorna false para valores divergentes', () => {
        expect(baseIsMatch({ a: 1 }, { a: 2 })).toBe(false);
        expect(baseIsMatch({ a: 1 }, { b: 1 })).toBe(false);
    });

    it('suporta customizer para personalizar o casamento de valores', () => {
        const obj = { a: 1, b: 2 };
        const src = { a: 10, b: 2 };
        const match = baseIsMatch(obj, src, (objVal, srcVal, key) => {
            if (key === 'a') return true;
        });
        expect(match).toBe(true);
    });

    it('trata arrays com casamento guloso de elementos', () => {
        expect(baseIsMatch({ a: [1, 2, 3] }, { a: [2, 1] })).toBe(true);
        expect(baseIsMatch({ a: [1, 2] }, { a: [3] })).toBe(false);
    });
});
