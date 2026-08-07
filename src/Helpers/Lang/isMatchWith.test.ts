import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { isMatchWith } from './isMatchWith';

describe('isMatchWith', () => {
    it('cai de volta no isMatch padrão quando customizer não é função (peculiaridade)', () => {
        expect(isMatchWith({ a: 1, b: 2 }, { a: 1 })).toBe(true);

        expect(isMatchWith({ a: 1, b: 2 }, { a: 1 }, 'not a function' as any)).toBe(true);
    });

    it('usa o resultado do customizer quando ele não retorna undefined', () => {
        const customizer = (objValue: unknown, srcValue: unknown) =>
            typeof objValue === 'string' && typeof srcValue === 'string'
                ? objValue.toLowerCase() === srcValue.toLowerCase()
                : undefined;
        expect(isMatchWith({ a: 'ABC' }, { a: 'abc' }, customizer)).toBe(true);
        expect(isMatchWith({ a: 'ABC' }, { a: 'xyz' }, customizer)).toBe(false);
    });

    it('permite customizer forçar resultado mesmo quando os valores diferem', () => {
        expect(isMatchWith({ a: 1 }, { a: 99 }, () => true)).toBe(true);
        expect(isMatchWith({ a: 1 }, { a: 1 }, () => false)).toBe(false);
    });

    it('cai de volta na comparação padrão quando customizer retorna undefined para o par', () => {
        expect(isMatchWith({ a: 1, b: 2 }, { a: 1, b: 2 }, () => undefined)).toBe(true);
    });

    it('funciona com Ref', () => {
        expect(isMatchWith(ref({ a: 1, b: 2 }), ref({ a: 1 }))).toBe(true);
    });

    it('invoca o customizer com (objValue, srcValue, key, object, source) (peculiaridade)', () => {
        let received: unknown[] = [];
        isMatchWith({ a: 1 }, { a: 2 }, (...args) => {
            received = args;
            return undefined;
        });
        expect(received).toEqual([1, 2, 'a', { a: 1 }, { a: 2 }]);
    });
});
