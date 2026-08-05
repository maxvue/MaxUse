import { describe, it, expect } from 'vitest';
import { asyncComputed } from '@vueuse/core';
import { _ } from '../index';
import { get as ownGet } from './Objects/get';
import { chunk as ownChunk } from './Iterables/chunk';
import { isEqual as ownIsEqual } from './Objects/isEqual';

/**
 * Narrowing local apenas para este teste: permite verificar em runtime a
 * presença de chaves exclusivas do Lodash (ex.: `curry`, `compact`) que não
 * são estaticamente visíveis no tipo inferido de `_`, sem afetar o tipo
 * público exportado em `src/index.ts`.
 */
const anyUnderscore = _ as Record<string, unknown>;

describe('precedência do objeto _', () => {
    it('helpers próprios vencem os homônimos do Lodash', () => {
        expect(_.get).toBe(ownGet);
        expect(_.chunk).toBe(ownChunk);
        expect(_.isEqual).toBe(ownIsEqual);
    });

    it('mantém os helpers exclusivos do Lodash disponíveis', () => {
        expect(typeof anyUnderscore.curry).toBe('function');
        expect(typeof anyUnderscore.compact).toBe('function');
    });

    it('mantém os helpers exclusivos do VueUse disponíveis', () => {
        expect(_.asyncComputed).toBe(asyncComputed);
    });
});
