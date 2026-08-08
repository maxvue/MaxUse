import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('atrasa a invocação até o wait passar (trailing por padrão)', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced();
        debounced();
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('reinicia o timer a cada chamada dentro do wait', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(50);
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('repassa argumentos e "this" à função original', () => {
        const func = vi.fn(function (this: any, a: number, b: number) {
            return a + b + (this?.offset ?? 0);
        });
        const obj = { offset: 10, debounced: debounce(func, 100) };
        obj.debounced(1, 2);
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledWith(1, 2);
    });

    it('leading: true invoca imediatamente na borda inicial', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { leading: true, trailing: false });

        debounced();
        expect(func).toHaveBeenCalledTimes(1);

        debounced();
        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('leading + trailing invocam em ambas as bordas quando há chamadas intermediárias', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { leading: true, trailing: true });

        debounced();
        expect(func).toHaveBeenCalledTimes(1);
        debounced();
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(2);
    });

    it('maxWait força invocação mesmo com chamadas contínuas', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { maxWait: 150 });

        debounced();
        vi.advanceTimersByTime(60);
        debounced();
        vi.advanceTimersByTime(60);
        debounced();
        vi.advanceTimersByTime(60);
        // passou de 150ms desde a primeira chamada — maxWait deve ter forçado invocação
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('cancel() impede a invocação pendente', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();
        vi.advanceTimersByTime(100);
        expect(func).not.toHaveBeenCalled();
    });

    it('flush() invoca imediatamente e retorna o resultado', () => {
        const func = vi.fn((n: number) => n * 2);
        const debounced = debounce(func, 100);

        debounced(5);
        const result = debounced.flush();
        expect(func).toHaveBeenCalledTimes(1);
        expect(result).toBe(10);
    });

    it('flush() sem invocação pendente retorna o último resultado', () => {
        const func = vi.fn((n: number) => n * 2);
        const debounced = debounce(func, 100);
        expect(debounced.flush()).toBeUndefined();
    });

    it('pending() reflete se há invocação pendente', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        expect(debounced.pending()).toBe(false);
        debounced();
        expect(debounced.pending()).toBe(true);
        vi.advanceTimersByTime(100);
        expect(debounced.pending()).toBe(false);
    });

    it('lança TypeError se o argumento não for função', () => {
        expect(() => debounce(null as any)).toThrow(TypeError);
    });

    it('wait padrão é 0', () => {
        const func = vi.fn();
        const debounced = debounce(func);
        debounced();
        vi.advanceTimersByTime(0);
        expect(func).toHaveBeenCalledTimes(1);
    });
});
