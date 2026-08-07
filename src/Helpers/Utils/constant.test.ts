import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { constant } from './constant';

describe('constant', () => {
    it('cria função que sempre retorna o mesmo valor', () => {
        const f = constant(5);
        expect(f()).toBe(5);
        expect(f()).toBe(5);
    });

    it('retorna a mesma referência de objeto a cada chamada (peculiaridade: resolvido uma única vez)', () => {
        const obj = { a: 1 };
        const f = constant(obj);
        expect(f()).toBe(obj);
        expect(f()).toBe(f());
    });

    it('funciona com Ref', () => {
        const f = constant(ref(10));
        expect(f()).toBe(10);
    });
});
