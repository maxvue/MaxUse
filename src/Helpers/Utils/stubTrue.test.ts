import { describe, it, expect } from 'vitest';
import { stubTrue } from './stubTrue';

describe('stubTrue', () => {
    it('retorna sempre true', () => {
        expect(stubTrue()).toBe(true);
    });

    it('ignora os argumentos recebidos', () => {
        expect((stubTrue as (...a: unknown[]) => boolean)(1, 2, 3)).toBe(true);
    });
});
