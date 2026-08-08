import { describe, it, expect } from 'vitest';
import { stubTrue } from './stubTrue';

describe('stubTrue', () => {
    it('retorna sempre true', () => {
        expect(stubTrue()).toBe(true);
    });

    it('ignora quaisquer argumentos', () => {
        expect((stubTrue as any)(1, 2, 3)).toBe(true);
    });
});
