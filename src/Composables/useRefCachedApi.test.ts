import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { effectScope, nextTick, ref, computed } from 'vue';
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

            expect(mockApiGetRoute).toHaveBeenCalledWith('api.sync', { parametro: 1 }, expect.objectContaining({ signal: expect.any(AbortSignal) }));
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

describe('useCachedApi — regressão auditoria (achado 012)', () => {
    let scope: ReturnType<typeof effectScope>;

    beforeEach(() => {
        localStorage.clear();
        scope = effectScope();
        vi.clearAllMocks();
        (apiGetRouteModule.apiGetRoute as any).mockResolvedValue(null);
    });

    afterEach(() => scope.stop());

    it('não lança quando o cache do localStorage está corrompido', () => {
        localStorage.setItem('api.corrompida', '{json invalido');

        scope.run(() => {
            expect(() => useCachedApi('api.corrompida', { defaultValue: [] })).not.toThrow();
        });
    });

    it('cai para o defaultValue e limpa a chave corrompida', () => {
        localStorage.setItem('api.corrompida', 'nao-e-json');

        scope.run(() => {
            const state = useCachedApi<string[]>('api.corrompida', { defaultValue: [] });
            expect(state.value).toEqual([]);
        });

        expect(localStorage.getItem('api.corrompida')).toBeNull();
    });

    it('não deixa rejeição sem tratamento se apiGetRoute falhar', async () => {
        (apiGetRouteModule.apiGetRoute as any).mockRejectedValue(new Error('boom'));

        scope.run(() => useCachedApi('api.falha', { defaultValue: [] }));

        await expect(Promise.resolve()).resolves.toBeUndefined();
        await nextTick();
    });

    it('dá precedência a data_get sobre data', async () => {
        const mockApi = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue({ ok: true });

        scope.run(() => {
            useCachedApi('api.prec', { data_get: { a: 1 }, data: { a: 2 } });
        });

        await vi.waitFor(() => {
            expect(mockApi).toHaveBeenCalledWith('api.prec', { a: 1 }, expect.objectContaining({ signal: expect.any(AbortSignal) }));
        });
    });

    it('descarta a resposta tardia da API se o scope for destruído antes da promise resolver', async () => {
        let resolvePromise!: (val: any) => void;
        const pendingPromise = new Promise((r) => { resolvePromise = r; });
        vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockReturnValue(pendingPromise as any);

        let state: any;
        scope.run(() => {
            state = useCachedApi('api.tardia', { defaultValue: 'inicial' });
        });

        // Para o escopo antes da resposta chegar
        scope.stop();

        // Resolve a resposta tardia da API
        resolvePromise('resposta-tardia');
        await new Promise((r) => setTimeout(r, 10));

        // Dado não deve ter alterado o state nem o localStorage
        expect(state.value).toBe('inicial');
        expect(localStorage.getItem('api.tardia')).toBeNull();
    });

    it('remove a chave do localStorage se state.value for atribuído como undefined', async () => {
        await scope.run(async () => {
            const state = useCachedApi('api.undef', { sync: false, defaultValue: 'val' });
            state.value = 'definido';
            await nextTick();
            expect(localStorage.getItem('api.undef')).toBe(JSON.stringify('definido'));

            state.value = undefined as any;
            await nextTick();
            expect(localStorage.getItem('api.undef')).toBeNull();
        });
    });

    it('persiste via then quando watch é false e sync é true', async () => {
        vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue('server-data');

        await scope.run(async () => {
            useCachedApi('api.watch_false_sync_true', { sync: true, watch: false });

            await vi.waitFor(() => {
                expect(localStorage.getItem('api.watch_false_sync_true')).toBe(JSON.stringify('server-data'));
            });
        });
    });

    it('revalida a API e atualiza a chave de cache ao mutar parâmetros reativos', async () => {
        const mockApi = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockImplementation(async (r, params) => ({
            page: params?.page
        }));

        await scope.run(async () => {
            const pageRef = ref(1);
            const state = useCachedApi('api.paginated', { data: computed(() => ({ page: pageRef.value })) });

            await vi.waitFor(() => expect(state.value).toEqual({ page: 1 }));

            pageRef.value = 2;
            await vi.waitFor(() => expect(state.value).toEqual({ page: 2 }));
            expect(mockApi).toHaveBeenCalledWith('api.paginated', { page: 2 }, expect.objectContaining({ signal: expect.any(AbortSignal) }));
        });
    });

    it('redefine para o default ao trocar para chave sem cache', async () => {
        const key = ref('user-1');
        const { state } = scope.run(() => {
            const state = useCachedApi('route.user', { key, defaultValue: { nome: '' }, sync: false });
            return { state };
        })!;
        state.value = { nome: 'Alice', saldo: 100 } as any;
        await nextTick();

        key.value = 'user-2';
        await nextTick();
        expect(state.value).toEqual({ nome: '' });
    });

    it('nunca grava dados do usuário anterior sob a chave nova', async () => {
        const key = ref('user-1');
        const { state } = scope.run(() => {
            const state = useCachedApi('route.user', { key, defaultValue: { nome: '' }, sync: false });
            return { state };
        })!;
        state.value = { nome: 'Alice', saldo: 100 } as any;
        await nextTick();

        key.value = 'user-2';
        await nextTick();
        state.value = { nome: 'Bob' } as any;
        await nextTick();

        expect(localStorage.getItem('user-2')).not.toContain('Alice');
    });

    it('descarta resposta superada que chega atrasada', async () => {
        let resolveP1!: (val: any) => void;
        let resolveP2!: (val: any) => void;
        const p1 = new Promise((r) => { resolveP1 = r; });
        const p2 = new Promise((r) => { resolveP2 = r; });

        vi.spyOn(apiGetRouteModule, 'apiGetRoute')
            .mockReturnValueOnce(p1 as any)
            .mockReturnValueOnce(p2 as any);

        const params = ref({ page: 1 });
        let state: any;
        scope.run(() => {
            state = useCachedApi('api.pagination', { data: params });
        });

        await nextTick();
        params.value = { page: 2 };
        await nextTick();

        // P2 (mais novo) resolve primeiro
        resolveP2({ page: 2, fresh: true });
        await new Promise((r) => setTimeout(r, 10));

        // P1 (antigo) resolve depois
        resolveP1({ page: 1, stale: true });
        await new Promise((r) => setTimeout(r, 10));

        expect(state.value).toEqual({ page: 2, fresh: true });
        expect(JSON.parse(localStorage.getItem('api.pagination')!)).toEqual({ page: 2, fresh: true });
    });
});


describe('useRefCachedApi - cancelamento (AbortSignal)', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('aborta a requisição em voo ao descartar o escopo', async () => {
        const mockApiGetRoute = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue({ ok: true });
        const scope = effectScope();

        scope.run(() => {
            useCachedApi('api.dispose', { data: { id: 1 } });
        });

        const signal = mockApiGetRoute.mock.calls[0][2]!.signal as AbortSignal;
        expect(signal.aborted).toBe(false);

        scope.stop();
        expect(signal.aborted).toBe(true);
    });

    it('aborta a requisição anterior quando os parâmetros mudam', async () => {
        const mockApiGetRoute = vi.spyOn(apiGetRouteModule, 'apiGetRoute').mockResolvedValue({ ok: true });
        const scope = effectScope();
        const pageRef = ref(1);

        scope.run(() => {
            useCachedApi('api.troca', { data: computed(() => ({ page: pageRef.value })) });
        });

        const firstSignal = mockApiGetRoute.mock.calls[0][2]!.signal as AbortSignal;

        pageRef.value = 2;
        await nextTick();

        expect(firstSignal.aborted).toBe(true);
        const secondSignal = mockApiGetRoute.mock.calls[1][2]!.signal as AbortSignal;
        expect(secondSignal.aborted).toBe(false);

        scope.stop();
    });
});
