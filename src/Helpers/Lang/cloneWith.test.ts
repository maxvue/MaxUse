import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { cloneWith } from './cloneWith';

describe('cloneWith', () => {
    it('usa o resultado do customizer quando ele não retorna undefined', () => {
        expect(cloneWith(5, (value) => (typeof value === 'number' ? value * 10 : undefined))).toBe(50);
    });

    it('cai de volta no clone padrão quando o customizer retorna undefined (peculiaridade)', () => {
        expect(cloneWith({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(cloneWith({ a: 1, b: 2 }, () => undefined)).toEqual({ a: 1, b: 2 });
    });

    it('ignora customizer que não é função', () => {

        expect(cloneWith({ a: 1 }, 'not a function' as any)).toEqual({ a: 1 });
    });

    it('preserva mesma referência de valores aninhados quando não customizados (clonagem rasa)', () => {
        const nested = { c: 2 };
        const cloned = cloneWith({ a: 1, b: nested });
        expect(cloned.b).toBe(nested);
    });

    it('funciona com Ref', () => {
        expect(cloneWith(ref(5), (value) => (typeof value === 'number' ? value * 2 : undefined))).toBe(10);
    });
});
