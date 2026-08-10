import { describe, expect, it } from 'vitest';
import * as lib from './index';

describe('infra: invariants exports == _', () => {
    it('todo export nomeado existe em _ e é a mesma referência', () => {
        const flat = Object.keys(lib).filter((k) => !['_', 'vueUse', 'default'].includes(k));
        for (const k of flat) {
            expect(lib._, `_ não contém ${k}`).toHaveProperty(k);
            expect((lib._ as Record<string, unknown>)[k], `_.${k} !== ${k}`).toBe((lib as Record<string, unknown>)[k]);
        }
    });

    it('_ não expõe nada além dos exports nomeados', () => {
        const flat = new Set(Object.keys(lib));
        expect(Object.keys(lib._).filter((k) => !flat.has(k))).toEqual([]);
    });
});
