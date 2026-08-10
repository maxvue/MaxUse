import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedApiIDB, clearCacheIDB, deleteFromIDB } from './getCachedApiIDB';
import axios from 'axios';
import * as config from './config';
import { setupIDBMock } from './internal/testing/idbMock';
import { resetIDBConnection } from './internal/idbCache';

vi.mock('axios');
vi.mock('./config', () => ({
    resolveRoute: vi.fn(),
    hasRoute: vi.fn(),
    getConfiguredHeaders: vi.fn(() => ({})),
    getWithCredentials: vi.fn(() => true),
    resetConfig: vi.fn(),
    onResetConfig: vi.fn()
}));

const idb = setupIDBMock();

describe('getCachedApiIDB', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        idb.reset();
        resetIDBConnection();

        (config.resolveRoute as any).mockImplementation((name: string, params: any) =>
            `https://example.com/${name}${params && params.id ? '/' + params.id : ''}`
        );
    });

    it('retorna null se routeName for vazio', async () => {
        const result = await getCachedApiIDB('');
        expect(result).toBeNull();
    });

    it('faz requisição se cache estiver vazio e salva no IDB', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'IDBTest' } });

        const result = await getCachedApiIDB('test.idb', { id: 1 });

        expect(config.resolveRoute).toHaveBeenCalledWith('test.idb', { id: 1 });
        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 1, name: 'IDBTest' });

        const cached = idb.mockStore.get('test.idb_{"id":1}');
        expect(cached.data).toEqual({ id: 1, name: 'IDBTest' });
    });

    it('retorna do cache imediatamente e revalida em background', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 2, name: 'FreshIDB' } });

        idb.mockStore.set('test.idb_{"id":2}', {
            key: 'test.idb_{"id":2}',
            data: { id: 2, name: 'CachedIDB' },
            timestamp: Date.now()
        });

        const result = await getCachedApiIDB('test.idb', { id: 2 });

        // Retorna o dado cacheado sem esperar a revalidação
        expect(result).toEqual({ id: 2, name: 'CachedIDB' });

        // A revalidação em background atualiza o cache com o dado fresco
        await vi.waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
            expect(idb.mockStore.get('test.idb_{"id":2}').data).toEqual({ id: 2, name: 'FreshIDB' });
        });
    });

    it('retorna dados com valores falsy do cache sem refazer requisição inicial', async () => {
        idb.mockStore.set('test.idb_{"id":0}', {
            key: 'test.idb_{"id":0}',
            data: 0,
            timestamp: Date.now()
        });

        (axios.get as any).mockResolvedValue({ data: 0 });

        const result = await getCachedApiIDB('test.idb', { id: 0 });
        expect(result).toBe(0);
    });

    it('chama onUpdate quando a revalidação encontra dado diferente do cache', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 5, name: 'FreshData' } });

        idb.mockStore.set('test.idb_{"id":5}', {
            key: 'test.idb_{"id":5}',
            data: { id: 5, name: 'StaleData' },
            timestamp: Date.now()
        });

        const onUpdate = vi.fn();
        const result = await getCachedApiIDB('test.idb', { id: 5 }, null, undefined, onUpdate);

        expect(result).toEqual({ id: 5, name: 'StaleData' });

        await vi.waitFor(() => {
            expect(onUpdate).toHaveBeenCalledWith({ id: 5, name: 'FreshData' });
        });
    });

    it('não chama onUpdate quando o dado do servidor é igual ao cache', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 6, name: 'SameData' } });

        idb.mockStore.set('test.idb_{"id":6}', {
            key: 'test.idb_{"id":6}',
            data: { id: 6, name: 'SameData' },
            timestamp: Date.now()
        });

        const onUpdate = vi.fn();
        const result = await getCachedApiIDB('test.idb', { id: 6 }, null, undefined, onUpdate);

        expect(result).toEqual({ id: 6, name: 'SameData' });

        await vi.waitFor(() => expect(axios.get).toHaveBeenCalled());
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('não propaga erro da revalidação em background', async () => {
        (axios.get as any).mockRejectedValue(new Error('network fail'));

        idb.mockStore.set('test.idb_{"id":7}', {
            key: 'test.idb_{"id":7}',
            data: { id: 7, name: 'CachedOk' },
            timestamp: Date.now()
        });

        const result = await getCachedApiIDB('test.idb', { id: 7 });
        expect(result).toEqual({ id: 7, name: 'CachedOk' });

        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(idb.mockStore.get('test.idb_{"id":7}').data).toEqual({ id: 7, name: 'CachedOk' });
    });

    it('invalida cache expirado e cobre o catch() da exclusão falha', async () => {
        (axios.get as any).mockResolvedValue({ data: { id: 3, name: 'NewData' } });

        idb.mockStore.set('test.idb_{"id":3}', {
            key: 'test.idb_{"id":3}',
            data: { id: 3, name: 'OldData' },
            timestamp: Date.now() - 5000 // 5s atrás
        });

        idb.setDeleteError(true);
        const result = await getCachedApiIDB('test.idb', { id: 3 }, null, 1000); // ttl de 1s

        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 3, name: 'NewData' });
    });

    it('pode deletar entry do IDB', async () => {
        idb.mockStore.set('key1', { key: 'key1', data: 'data' });
        await deleteFromIDB('key1');
        expect(idb.mockStore.has('key1')).toBe(false);
    });

    it('pode limpar o banco todo', async () => {
        idb.mockStore.set('key1', { key: 'key1', data: 'data' });
        await clearCacheIDB();
        expect(idb.mockStore.has('key1')).toBe(false);
    });

    it('cobre branch onde a objectStore já existe (contains=true) e branch de dataToRequest=null', async () => {
        idb.setContainsStore(true);
        (axios.get as any).mockResolvedValue({ data: { id: 99, name: 'StoreExists' } });

        const result = await getCachedApiIDB('test.idb', null);

        expect(config.resolveRoute).toHaveBeenCalledWith('test.idb', {});
        expect(axios.get).toHaveBeenCalled();
        expect(result).toEqual({ id: 99, name: 'StoreExists' });
    });

    it('rejeita promise se houver erro ao abrir o banco', async () => {
        idb.setOpenError(true);
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('open error');
    });

    it('rejeita promise se houver erro no get', async () => {
        idb.setGetError(true);
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('get error');
    });

    it('rejeita promise se houver erro no put', async () => {
        idb.setPutError(true);
        (axios.get as any).mockResolvedValue({ data: { id: 1, name: 'IDBTest' } });
        await expect(getCachedApiIDB('test.idb', { id: 1 })).rejects.toThrow('put error');
    });

    it('rejeita promise se houver erro no delete', async () => {
        idb.setDeleteError(true);
        await expect(deleteFromIDB('key1')).rejects.toThrow('delete error');
    });

    it('rejeita promise se houver erro no clear', async () => {
        idb.setClearError(true);
        await expect(clearCacheIDB()).rejects.toThrow('clear error');
    });
});

describe('getCachedApiIDB — regressão auditoria (achados 004 e 005)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        idb.reset();
        resetIDBConnection();
        (config.resolveRoute as any).mockReturnValue('https://example.com/rota');
        (axios.get as any).mockResolvedValue({ data: { ok: true } });
    });

    it('envia os headers configurados via setApiRequestConfig', async () => {
        (config.getConfiguredHeaders as any).mockReturnValue({ Authorization: 'Bearer abc' });

        await getCachedApiIDB('api.rota');

        const callArgs = (axios.get as any).mock.calls[0];
        expect(callArgs[1].headers.Authorization).toBe('Bearer abc');
    });

    it('respeita withCredentials configurado como false', async () => {
        (config.getWithCredentials as any).mockReturnValue(false);

        await getCachedApiIDB('api.rota');

        const callArgs = (axios.get as any).mock.calls[0];
        expect(callArgs[1].withCredentials).toBe(false);
    });

    it('não muta axios.defaults.withCredentials (efeito colateral global)', async () => {
        (axios as any).defaults = { withCredentials: false };

        await getCachedApiIDB('api.rota');

        expect((axios as any).defaults.withCredentials).toBe(false);
    });
});
