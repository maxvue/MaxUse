import { describe, it, expect } from 'vitest';
import { now } from './now';

describe('now', () => {
    it('retorna timestamp numérico', () => {
        const result = now();
        expect(typeof result).toBe('number');
    });

    it('retorna timestamp próximo do Date.now()', () => {
        const before = Date.now();
        const result = now();
        const after = Date.now();
        expect(result).toBeGreaterThanOrEqual(before);
        expect(result).toBeLessThanOrEqual(after);
    });
});
