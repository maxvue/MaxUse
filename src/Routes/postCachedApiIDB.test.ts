import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postCachedApiIDB } from './postCachedApiIDB';
import axios from 'axios';
import * as config from './config';
import { setupIDBMock } from './internal/testing/idbMock';
import { resetIDBConnection } from './internal/idbCache';
import { buildCacheKey } from './internal/cacheUtils';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getClientIdHeader: vi.fn(() => ({})),
    getClientId: vi.fn(() => null),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn(),
    onResetConfig: vi.fn()
}));

const idb = setupIDBMock();

describe('postCachedApiIDB', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        idb.reset();
        resetIDBConnection();

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
        (config.getConfiguredHeaders as any).mockReturnValue({});
        (config.getClientIdHeader as any).mockReturnValue({});
        (config.getClientId as any).mockReturnValue(null);
        (config.getWithCredentials as any).mockReturnValue(true);
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await postCachedApiIDB('');
        expect(result).toBeNull();
    });

    it('faz requisição POST se cache estiver vazio e salva no IDB', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'PostIDBTest' } });

        const result = await postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' });

        expect(config.resolveRoute).toHaveBeenCalledWith('test.post', { id: 1 });
        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/test.post/1',
            { campo: 'valor' },
            expect.objectContaining({
                responseType: 'json',
                withCredentials: true,
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
        expect(result).toEqual({ id: 1, name: 'PostIDBTest' });

        const cacheKey = buildCacheKey('test.post', { routeParams: { id: 1 }, postData: { campo: 'valor' } });
        const cached = idb.mockStore.get(cacheKey);
        expect(cached.data).toEqual({ id: 1, name: 'PostIDBTest' });
    });

    it('retorna do cache e não faz requisição', async () => {
        const cacheKey = buildCacheKey('test.post', { routeParams: { id: 2 }, postData: { campo: 'valor2' } });
        idb.mockStore.set(cacheKey, {
            key: cacheKey,
            data: { id: 2, name: 'CachedPostIDB' },
            timestamp: Date.now()
        });

        const result = await postCachedApiIDB('test.post', { id: 2 }, { campo: 'valor2' });

        expect(axios.post).not.toHaveBeenCalled();
        expect(result).toEqual({ id: 2, name: 'CachedPostIDB' });
    });

    it('retorna valor falsy do cache sem fazer requisição HTTP', async () => {
        const cacheKey = buildCacheKey('test.post', { routeParams: { id: 0 }, postData: {} });
        idb.mockStore.set(cacheKey, {
            key: cacheKey,
            data: 0,
            timestamp: Date.now()
        });

        const result = await postCachedApiIDB('test.post', { id: 0 });

        expect(axios.post).not.toHaveBeenCalled();
        expect(result).toBe(0);
    });

    it('invalida cache expirado e cobre o catch() da exclusão falha', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 3, name: 'NewPostData' } });

        const cacheKey = buildCacheKey('test.post', { routeParams: { id: 3 }, postData: { campo: 'valor3' } });
        idb.mockStore.set(cacheKey, {
            key: cacheKey,
            data: { id: 3, name: 'OldPostData' },
            timestamp: Date.now() - 5000 // 5s atrás
        });

        idb.setDeleteError(true);
        const result = await postCachedApiIDB('test.post', { id: 3 }, { campo: 'valor3' }, null, 1000); // ttl de 1s

        expect(axios.post).toHaveBeenCalled();
        expect(result).toEqual({ id: 3, name: 'NewPostData' });
    });

    it('usa keyCache personalizada quando fornecida', async () => {
        (axios.post as any).mockResolvedValue({ data: { id: 4, name: 'CustomKey' } });

        const result = await postCachedApiIDB('test.post', { id: 4 }, { campo: 'valor4' }, 'minha_chave_customizada');

        expect(result).toEqual({ id: 4, name: 'CustomKey' });

        const cached = idb.mockStore.get('minha_chave_customizada');
        expect(cached.data).toEqual({ id: 4, name: 'CustomKey' });
    });

    it('cobre branch onde a objectStore já existe (contains=true) e routeParams/postData=null', async () => {
        idb.setContainsStore(true);
        (axios.post as any).mockResolvedValue({ data: { id: 99, name: 'StoreExists' } });

        const result = await postCachedApiIDB('test.post', null, null);

        expect(config.resolveRoute).toHaveBeenCalledWith('test.post', {});
        expect(axios.post).toHaveBeenCalledWith(
            'https://example.com/test.post',
            {},
            expect.any(Object)
        );
        expect(result).toEqual({ id: 99, name: 'StoreExists' });
    });

    it('inclui headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ 'Authorization': 'Bearer test-token' });
        (axios.post as any).mockResolvedValue({ data: { id: 5, name: 'WithAuth' } });

        await postCachedApiIDB('test.post', null, { campo: 'valor5' });

        expect(axios.post).toHaveBeenCalledWith(
            expect.any(String),
            { campo: 'valor5' },
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer test-token'
                })
            })
        );
    });

    it('busca na rede quando há erro ao abrir o banco no postCachedApiIDB', async () => {
        idb.setOpenError(true);
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'PostIDBTest' } });
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).resolves.toEqual({ id: 1, name: 'PostIDBTest' });
    });

    it('busca na rede quando a leitura do cache falha no postCachedApiIDB (degradação graciosa)', async () => {
        idb.setGetError(true);
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'RedePostOk' } });
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).resolves.toEqual({ id: 1, name: 'RedePostOk' });
    });

    it('entrega dado da rede mesmo se a escrita no cache falhar no postCachedApiIDB', async () => {
        idb.setPutError(true);
        (axios.post as any).mockResolvedValue({ data: { id: 1, name: 'RedePostOk' } });
        await expect(postCachedApiIDB('test.post', { id: 1 }, { campo: 'valor' })).resolves.toEqual({ id: 1, name: 'RedePostOk' });
    });
});
