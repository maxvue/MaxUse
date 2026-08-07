import { describe, it, expect } from 'vitest';
import { stubString } from './stubString';

describe('stubString', () => {
    it('sempre retorna string vazia', () => {
        expect(stubString()).toBe('');
    });
});
