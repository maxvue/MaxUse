import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { methodOf } from './methodOf';

describe('methodOf', () => {
    it('invoca o método no caminho recebido, consultado no objeto fixado', () => {
        const obj = { a: { b(x: number, y: number) { return (this as any).c + x + y; }, c: 100 } };
        expect(methodOf(obj, 1, 2)('a.b')).toBe(103);
    });

    it('retorna undefined quando o caminho não resolve para função', () => {
        expect(methodOf({ a: {} })('a.x')).toBeUndefined();
    });

    it('retorna undefined quando o objeto é null ou undefined', () => {
        expect(methodOf(null)('a.b')).toBeUndefined();
        expect(methodOf(undefined)('a.b')).toBeUndefined();
    });

    it('fixa o objeto no momento da criação', () => {
        const obj = { a: { b: (x: number) => x + 1 } };
        const call = methodOf(obj, 10);
        obj.a.b = (x: number) => x + 100;
        expect(call('a.b')).toBe(110);
    });

    it('funciona com Ref', () => {
        expect(methodOf(ref({ a: { b: (x: number) => x * 2 } }), 5)('a.b')).toBe(10);
    });
});
