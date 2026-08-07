import { describe, it, expect } from 'vitest';
import { extendWith } from './extendWith';
import { assignInWith } from './assignInWith';

describe('extendWith', () => {
    it('é um alias de assignInWith', () => {
        expect(extendWith).toBe(assignInWith);
    });
});
