import { describe, it, expect } from 'vitest';
import { isTouchDevice } from './isTouchDevice';

describe('isTouchDevice', () => {
    it('retorna boolean', () => {
        const result = isTouchDevice();
        expect(typeof result).toBe('boolean');
    });

    it('retorna false em ambiente happy-dom (sem touch)', () => {
        // happy-dom não define ontouchstart nem maxTouchPoints > 0
        expect(isTouchDevice()).toBe(false);
    });
});
