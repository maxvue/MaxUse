import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('invoca a função depois de wait milissegundos', () => {
        const func = vi.fn();
        delay(func, 100);

        expect(func).not.toHaveBeenCalled();
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('repassa argumentos adicionais para a função', () => {
        const func = vi.fn();
        delay(func, 100, 1, 2, 3);

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledWith(1, 2, 3);
    });

    it('não invoca antes do wait', () => {
        const func = vi.fn();
        delay(func, 100);

        vi.advanceTimersByTime(50);
        expect(func).not.toHaveBeenCalled();
    });

    it('lança TypeError se func não for função', () => {
        expect(() => delay(null as any, 100)).toThrow(TypeError);
    });

    it('trata wait não numérico como 0', () => {
        const func = vi.fn();
        delay(func, 'x' as any);
        vi.advanceTimersByTime(0);
        expect(func).toHaveBeenCalledTimes(1);
    });
});
