import { describe, it, expect } from 'vitest';
import { baseMerge } from './_baseMerge';

describe('baseMerge', () => {
    it('mescla objetos profundamente', () => {
        const dest = { a: { x: 1 } };
        const src = { a: { y: 2 }, b: 3 };
        baseMerge(dest, src);
        expect(dest).toEqual({ a: { x: 1, y: 2 }, b: 3 });
    });

    it('bloqueia poluição de protótipo (__proto__, constructor, prototype)', () => {
        const dest = {};
        const src = JSON.parse('{"__proto__": {"polluted": true}}');
        baseMerge(dest, src);
        expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('suporta customizer para personalizar a mesclagem', () => {
        const dest = { a: [1, 2] };
        const src = { a: [3, 4] };
        baseMerge(dest, src, (objValue, srcValue) => {
            if (Array.isArray(objValue)) return objValue.concat(srcValue);
        });
        expect(dest).toEqual({ a: [1, 2, 3, 4] });
    });
});
