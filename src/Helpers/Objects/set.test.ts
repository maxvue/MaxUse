import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { set } from './set';

describe('set', () => {
    it('define valor em caminho simples', () => {
        const obj: any = {};
        set(obj, 'name', 'João');
        expect(obj.name).toBe('João');
    });

    it('define valor em caminho aninhado criando intermediários', () => {
        const obj: any = {};
        set(obj, 'a.b.c', 42);
        expect(obj.a.b.c).toBe(42);
    });

    it('atualiza valor existente', () => {
        const obj = { name: 'old' };
        set(obj, 'name', 'new');
        expect(obj.name).toBe('new');
    });

    it('aceita path como array', () => {
        const obj: any = {};
        set(obj, ['x', 'y'], 'value');
        expect(obj.x.y).toBe('value');
    });

    it('suporta notação de colchetes', () => {
        const obj: any = { arr: [1, 2, 3] };
        set(obj, 'arr[1]', 99);
        expect(obj.arr[1]).toBe(99);
    });

    it('retorna o objeto passado', () => {
        const obj = { a: 1 };
        const result = set(obj, 'b', 2);
        expect(result).toBe(obj);
    });

    it('lida com null como objeto (retorna sem erro)', () => {
        expect(() => set(null, 'a', 1)).not.toThrow();
    });

    it('lida com undefined como objeto (retorna sem erro)', () => {
        expect(() => set(undefined, 'a', 1)).not.toThrow();
    });

    // Reatividade
    it('funciona com Ref', () => {
        const obj = ref({ a: 1 } as any);
        set(obj, 'b', 2);
        expect(obj.value.b).toBe(2);
    });
});
