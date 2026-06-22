import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { useCachedApi } from './useRefCachedApi';
import * as apiGetRouteModule from '../Routes/apiGetRoute';

vi.mock('../Routes/apiGetRoute', () => {
    return {
        apiGetRoute: vi.fn()
    };
});

describe('useRefCachedApi', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        localStorage.clear();
        scope = effectScope();
        vi.clearAllMocks();
    });

    afterEach(() => {
        scope.stop();
        localStorage.clear();
    });

    it('inicializa com defaultValue se o localStorage estiver vazio', () => {
        scope.run(() => {
            const state = useCachedApi('minha.rota', { sync: false, defaultValue: 'padrao' });
            expect(state.value).toBe('padrao');
        });
    });

    it('carrega valor do localStorage na inicialização', () => {
        localStorage.setItem('minha.rota', JSON.stringify({ carregado: true }));
        scope.run(() => {
            const state = useCachedApi('minha.rota', { sync: false });
            expect(state.value).toEqual({ carregado: true });
        });
    });

    it('persiste os dados quando o state é alterado (watch: true)', async () => {
        await scope.run(async () => {
            const state = useCachedApi('rota.watch', { sync: false, defaultValue: { a: 1 } });
            state.value = { a: 2 };
            await nextTick();
            expect(JSON.parse(localStorage.getItem('rota.watch')!)).toEqual({ a: 2 });
        });
    });

    it('não persiste dados quando watch é false', async () => {
        await scope.run(async () => {
            const state = useCachedApi('rota.no_watch', { sync: false, watch: false, defaultValue: 'ini' });
            state.value = 'novo';
            await nextTick();
            expect(localStorage.getItem('rota.no_watch')).toBeNull();
        });
    });

    it('sincroniza com a API quando sync é true e atualiza o state e o localStorage', async () => {
        const fakeData = { do_server: true };
        const mockApiGetRoute = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue(fakeData);

        await scope.run(async () => {
            const state = useCachedApi('api.sync', { data: { parametro: 1 } });

            // Aguardar a promise da mock ser resolvida
            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(mockApiGetRoute).toHaveBeenCalledWith('api.sync', { parametro: 1 });
            expect(state.value).toEqual(fakeData);
            expect(JSON.parse(localStorage.getItem('api.sync')!)).toEqual(fakeData);
        });
    });

    it('não atualiza state ou cache se a api retornar valor nulo/indefinido', async () => {
        const mockApiGetRoute = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue(null);

        await scope.run(async () => {
            const state = useCachedApi('api.null', { defaultValue: 'inicial' });

            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(mockApiGetRoute).toHaveBeenCalled();
            expect(state.value).toBe('inicial');
        });
    });

    it('usa key customizada em vez de route_name no localStorage', () => {
        localStorage.setItem('minha-key', JSON.stringify('valor-customizado'));

        scope.run(() => {
            const state = useCachedApi('rota.qualquer', { key: 'minha-key', sync: false });
            expect(state.value).toBe('valor-customizado');
        });
    });
});
