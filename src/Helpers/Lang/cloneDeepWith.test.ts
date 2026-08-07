import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { cloneDeepWith } from './cloneDeepWith';

describe('cloneDeepWith', () => {
    it('clona profundamente quando o customizer retorna undefined em todos os níveis', () => {
        const nested = { b: 1 };
        const original = { a: nested };
        const cloned = cloneDeepWith(original);
        expect(cloned).toEqual(original);
        expect(cloned.a).not.toBe(nested);
    });

    it('aplica o customizer recursivamente em cada nível visitado (peculiaridade)', () => {
        const customizer = (value: unknown) => (typeof value === 'number' ? (value as number) + 1 : undefined);
        expect(cloneDeepWith({ a: 1, b: { c: 2 } }, customizer)).toEqual({ a: 2, b: { c: 3 } });
    });

    it('ignora customizer que não é função', () => {

        expect(cloneDeepWith({ a: 1 }, 'not a function' as any)).toEqual({ a: 1 });
    });

    it('trata referências circulares sem estourar a pilha', () => {
        const circular: Record<string, unknown> = { a: 1 };
        circular.self = circular;
        const cloned = cloneDeepWith(circular) as Record<string, unknown>;
        expect(cloned.self).toBe(cloned);
        expect(cloned).not.toBe(circular);
    });

    it('funciona com Ref', () => {
        const nested = { b: 1 };
        const cloned = cloneDeepWith(ref({ a: nested }));
        expect(cloned).toEqual({ a: { b: 1 } });
        expect(cloned.a).not.toBe(nested);
    });
});
