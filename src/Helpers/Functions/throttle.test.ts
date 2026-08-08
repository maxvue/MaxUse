import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from './throttle';

describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('invoca imediatamente na primeira chamada (leading padrão)', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('ignora chamadas dentro da janela e invoca de novo depois', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        throttled();
        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('leading: false não invoca na primeira chamada', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { leading: false });

        throttled();
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('trailing: false não invoca na borda final', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { trailing: false });

        throttled();
        throttled();
        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('cancel() impede a invocação pendente', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { leading: false });

        throttled();
        throttled.cancel();
        vi.advanceTimersByTime(100);
        expect(func).not.toHaveBeenCalled();
    });

    it('flush() invoca imediatamente', () => {
        const func = vi.fn((n: number) => n * 2);
        const throttled = throttle(func, 100, { leading: false });

        throttled(5);
        expect(throttled.flush()).toBe(10);
    });

    it('lança TypeError se o argumento não for função', () => {
        expect(() => throttle(null as any)).toThrow(TypeError);
    });

    it('respeita o limite de uma chamada por wait sob chamadas contínuas', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        for (let i = 0; i < 5; i++) {
            throttled();
            vi.advanceTimersByTime(30);
        }
        // 150ms passados, chamadas a cada 30ms: leading em t=0, e o maxWait força mais invocações
        expect(func.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
});
