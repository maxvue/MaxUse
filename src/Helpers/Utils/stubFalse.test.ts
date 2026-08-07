import { describe, it, expect } from 'vitest';
import { stubFalse } from './stubFalse';

describe('stubFalse', () => {
    it('sempre retorna false', () => {
        expect(stubFalse()).toBe(false);
    });
});
