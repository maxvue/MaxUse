import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, ref, nextTick } from 'vue';
import { watchIfValid, watchDebounceIfValid, watchValid, watchIsValid, watchDebouncedValid, watchTrue } from './watchTrue';

describe('watchIfValid', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
    });

    it('não dispara callback para valor null sem immediate', async () => {
        await scope.run(async () => {
            const source = ref<string | null>(null);
            const callback = vi.fn();

            watchIfValid(source, callback);
            await nextTick();

            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('não dispara callback para string vazia sem mudança', async () => {
        await scope.run(async () => {
            const source = ref('');
            const callback = vi.fn();

            watchIfValid(source, callback);
            source.value = '';
            await nextTick();

            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('NÃO dispara callback quando valor muda para null/vazio', async () => {
        await scope.run(async () => {
            const source = ref<string | null>('has-content');
            const callback = vi.fn();

            watchIfValid(source, callback);
            await nextTick();

            source.value = null;
            await nextTick();

            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('dispara quando valor muda para algo com conteúdo', async () => {
        await scope.run(async () => {
            const source = ref<string | null>(null);
            const callback = vi.fn();

            watchIfValid(source, callback);
            await nextTick();

            source.value = 'valid-content';
            await nextTick();

            expect(callback).toHaveBeenCalled();
        });
    });

    it('suporta option once (para na primeira execução válida)', async () => {
        await scope.run(async () => {
            const source = ref<string | null>(null);
            const callback = vi.fn();

            watchIfValid(source, callback, { once: true });
            await nextTick();

            source.value = 'content';
            await nextTick();
            
            source.value = 'other-content';
            await nextTick();

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});

describe('watchDebounceIfValid', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        vi.useFakeTimers();
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
        vi.useRealTimers();
    });

    it('NÃO dispara callback com debounce quando valor fica vazio', async () => {
        await scope.run(async () => {
            const source = ref<string | null>('content');
            const callback = vi.fn();

            watchDebounceIfValid(source, callback, { debounce: 50 });
            await nextTick();

            source.value = null;
            await nextTick();

            // Avança o debounce
            vi.advanceTimersByTime(100);
            await nextTick();

            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('dispara quando valor tem conteúdo após debounce', async () => {
        await scope.run(async () => {
            const source = ref<string | null>(null);
            const callback = vi.fn();

            watchDebounceIfValid(source, callback, { debounce: 50 });
            await nextTick();

            source.value = 'valid';
            await nextTick();
            vi.runAllTimers();
            await nextTick();

            expect(callback).toHaveBeenCalled();
        });
    });

    it('testa a condição isNotEmpty verdadeira diretamente no debounce', async () => {
        await scope.run(async () => {
            const source = ref<string>('valid');
            const callback = vi.fn();
            
            watchDebounceIfValid(source, callback, { debounce: 50, immediate: true });
            await nextTick();
            vi.runAllTimers();
            await nextTick();
            
            expect(callback).toHaveBeenCalled();
        });
    });

    it('suporta option once (para na primeira execução válida)', async () => {
        await scope.run(async () => {
            const source = ref<string | null>(null);
            const callback = vi.fn();

            watchDebounceIfValid(source, callback, { debounce: 50, once: true });
            await nextTick();

            source.value = 'content';
            await nextTick();
            vi.advanceTimersByTime(100);
            await nextTick();
            await nextTick();

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});

describe('aliases', () => {
    it('watchTrue é whenever do VueUse', () => {
        expect(typeof watchTrue).toBe('function');
    });

    it('watchValid é alias de watchIfValid', () => {
        expect(watchValid).toBe(watchIfValid);
    });

    it('watchIsValid é alias de watchIfValid', () => {
        expect(watchIsValid).toBe(watchIfValid);
    });

    it('watchDebouncedValid é alias de watchDebounceIfValid', () => {
        expect(watchDebouncedValid).toBe(watchDebounceIfValid);
    });
});
