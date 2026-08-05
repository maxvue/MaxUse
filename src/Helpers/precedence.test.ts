import { describe, it, expect } from 'vitest';
import { _ } from '../index';
import { get as ownGet } from './Objects/get';
import { chunk as ownChunk } from './Iterables/chunk';
import { isEqual as ownIsEqual } from './Objects/isEqual';

describe('precedência do objeto _', () => {
    it('helpers próprios vencem os homônimos do Lodash', () => {
        expect(_.get).toBe(ownGet);
        expect(_.chunk).toBe(ownChunk);
        expect(_.isEqual).toBe(ownIsEqual);
    });

    it('mantém os helpers exclusivos do Lodash disponíveis', () => {
        expect(typeof _.curry).toBe('function');
        expect(typeof _.compact).toBe('function');
    });

    it('mantém os helpers do VueUse disponíveis', () => {
        expect(typeof _.useStorage).toBe('function');
    });
});
