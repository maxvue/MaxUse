import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { method } from './method';

describe('method', () => {
    it('invoca o método no caminho, com this ligado ao objeto pai', () => {
        const obj = { a: { b(x: number, y: number) { return (this as any).c + x + y; }, c: 100 } };
        expect(method('a.b', 1, 2)(obj)).toBe(103);
    });

    it('sem argumentos extras, invoca sem parâmetros', () => {
        const obj = { a: { b(x?: number) { return x; } } };
        expect(method('a.b')(obj)).toBeUndefined();
    });

    it('retorna undefined quando o caminho não resolve para função', () => {
        expect(method('a.x')({ a: {} })).toBeUndefined();
    });

    it('retorna undefined para objeto null ou undefined', () => {
        expect(method('a.x')(null)).toBeUndefined();
        expect(method('a.x')(undefined)).toBeUndefined();
    });

    it('resolve o caminho uma única vez, no momento da criação', () => {
        const path = ref('a.b');
        const call = method(path, 5);
        path.value = 'a.c';
        expect(call({ a: { b: (x: number) => x + 1, c: (x: number) => x + 2 } })).toBe(6);
    });

    it('funciona com Ref', () => {
        expect(method(ref('a.b'), 1)({ a: { b: (x: number) => x * 10 } })).toBe(10);
    });
});
