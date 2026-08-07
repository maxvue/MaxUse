import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defer } from './defer';

describe('defer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('não invoca a função de forma síncrona', () => {
        const func = vi.fn();
        defer(func);
        expect(func).not.toHaveBeenCalled();
    });

    it('invoca a função assim que a thread atual termina', () => {
        const func = vi.fn();
        defer(func);
        vi.advanceTimersByTime(1);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('repassa argumentos adicionais para a função', () => {
        const func = vi.fn();
        defer(func, 'a', 'b');
        vi.advanceTimersByTime(1);
        expect(func).toHaveBeenCalledWith('a', 'b');
    });

    it('lança TypeError se func não for função', () => {
        expect(() => defer(null as any)).toThrow(TypeError);
    });
});
