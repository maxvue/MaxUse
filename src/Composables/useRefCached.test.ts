import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { effectScope, ref, nextTick } from 'vue';
import { useRefCached } from './useRefCached';

describe('useRefCached', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        localStorage.clear();
        scope = effectScope();
    });

    afterEach(() => {
        scope.stop();
        localStorage.clear();
    });

    it('inicializa com valor padrão quando localStorage está vazio', () => {
        scope.run(() => {
            const state = useRefCached('test-key', 'default');
            expect(state.value).toBe('default');
        });
    });

    it('carrega valor do localStorage na inicialização', async () => {
        localStorage.setItem('test-key', JSON.stringify('cached-value'));

        await scope.run(async () => {
            const state = useRefCached('test-key', 'default');
            await nextTick();
            expect(state.value).toBe('cached-value');
        });
    });

    it('persiste valor no localStorage ao mudar', async () => {
        await scope.run(async () => {
            const state = useRefCached('persist-key', 'initial');
            state.value = 'new-value';
            await nextTick();
            expect(JSON.parse(localStorage.getItem('persist-key')!)).toBe('new-value');
        });
    });

    it('persiste objetos complexos', async () => {
        await scope.run(async () => {
            const state = useRefCached('obj-key', { a: 1 });
            state.value = { a: 99 } as any;
            await nextTick();
            expect(JSON.parse(localStorage.getItem('obj-key')!)).toEqual({ a: 99 });
        });
    });

    it('usa "no-key" quando key é null', async () => {
        await scope.run(async () => {
            const state = useRefCached(null, 'fallback');
            await nextTick();
            expect(state.value).toBe('fallback');
        });
    });

    it('usa "no-key" quando key é undefined', async () => {
        await scope.run(async () => {
            const state = useRefCached(undefined, 42);
            await nextTick();
            expect(state.value).toBe(42);
        });
    });

    it('suporta chave dinâmica via Ref', async () => {
        localStorage.setItem('dynamic-1', JSON.stringify('value-1'));
        localStorage.setItem('dynamic-2', JSON.stringify('value-2'));

        await scope.run(async () => {
            const key = ref('dynamic-1');
            const state = useRefCached(key, 'default');
            await nextTick();
            expect(state.value).toBe('value-1');

            key.value = 'dynamic-2';
            await nextTick();
            expect(state.value).toBe('value-2');
        });
    });

    it('sincroniza entre abas via StorageEvent', async () => {
        await scope.run(async () => {
            const state = useRefCached('sync-key', 'initial');
            await nextTick();

            // Simula evento de outra aba
            const event = new StorageEvent('storage', {
                key: 'sync-key',
                newValue: JSON.stringify('from-other-tab'),
                storageArea: localStorage
            });
            window.dispatchEvent(event);

            expect(state.value).toBe('from-other-tab');
        });
    });

    it('restaura default quando StorageEvent.newValue é null', async () => {
        await scope.run(async () => {
            const state = useRefCached('remove-key', 'default-val');
            state.value = 'changed';
            await nextTick();

            const event = new StorageEvent('storage', {
                key: 'remove-key',
                newValue: null,
                storageArea: localStorage
            });
            window.dispatchEvent(event);

            expect(state.value).toBe('default-val');
        });
    });

    it('ignora StorageEvent de outra chave', async () => {
        await scope.run(async () => {
            const state = useRefCached('my-key', 'original');
            await nextTick();

            const event = new StorageEvent('storage', {
                key: 'other-key',
                newValue: JSON.stringify('other-value'),
                storageArea: localStorage
            });
            window.dispatchEvent(event);

            expect(state.value).toBe('original');
        });
    });

    it('reverte para default quando JSON.parse falha no evento storage', async () => {
        await scope.run(async () => {
            const state = useRefCached('error-sync-key', 'default-val');
            await nextTick();

            const event = new StorageEvent('storage', {
                key: 'error-sync-key',
                newValue: 'valor-invalido-json',
                storageArea: localStorage
            });
            window.dispatchEvent(event);

            expect(state.value).toBe('default-val');
        });
    });

    it('reverte para default quando JSON.parse falha na leitura inicial', async () => {
        localStorage.setItem('invalid-key', 'valor-invalido-json');

        await scope.run(async () => {
            const state = useRefCached('invalid-key', 'default-val');
            await nextTick();
            expect(state.value).toBe('default-val');
        });
    });

    it('retorna silenciosamente quando a chave calculada for uma string vazia (ex: passando array vazio)', async () => {
        await scope.run(async () => {
            const state = useRefCached([] as any, 'default-val');
            await nextTick();
            expect(state.value).toBe('default-val');

            state.value = 'changed';
            await nextTick();

            expect(localStorage.getItem('')).toBeNull();
        });
    });

    it('não grava chave no localStorage na simples criação sem mutação', async () => {
        await scope.run(async () => {
            useRefCached('no-init-key', 'default-val');
            await nextTick();
            expect(localStorage.getItem('no-init-key')).toBeNull();
        });
    });

    it('suporta chave numérica 0', async () => {
        await scope.run(async () => {
            const state = useRefCached(0 as any, 'val0');
            state.value = 'changed0';
            await nextTick();
            expect(localStorage.getItem('0')).toBe(JSON.stringify('changed0'));
        });
    });

    it('não recria a chave no localStorage ao receber StorageEvent com newValue = null (sem eco)', async () => {
        await scope.run(async () => {
            const state = useRefCached('remove-eco-key', 'default-val');
            state.value = 'changed';
            await nextTick();
            expect(localStorage.getItem('remove-eco-key')).toBe(JSON.stringify('changed'));

            // Simula remoção por outra aba
            localStorage.removeItem('remove-eco-key');
            const event = new StorageEvent('storage', {
                key: 'remove-eco-key',
                newValue: null,
                storageArea: localStorage
            });
            window.dispatchEvent(event);

            await nextTick();
            expect(state.value).toBe('default-val');
            // Garante que o eco não recriou a chave no localStorage
            expect(localStorage.getItem('remove-eco-key')).toBeNull();
        });
    });

    it('preserva a escrita pendente na chave antiga ao mudar a chave no mesmo tick', async () => {
        await scope.run(async () => {
            const key = ref('key-a');
            const state = useRefCached(key, 'default');
            await nextTick();

            // Muta valor e chave no mesmo tick
            state.value = 'mutated-a';
            key.value = 'key-b';
            await nextTick();
            await nextTick();

            // key-a deve ter salvo 'mutated-a'
            expect(localStorage.getItem('key-a')).toBe(JSON.stringify('mutated-a'));
            // state deve ter assumido o valor da nova key-b (que é default pois key-b está vazia)
            expect(state.value).toBe('default');
        });
    });
});
